import { useEffect, useState, FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Timer, AlertCircle, AlertTriangle, CookingPot, CheckCircle2, Soup, Clock, ChefHat, LucideIcon } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';

interface Detalle { cantidad: number; notas?: string | null; producto?: { nombre: string }; }
interface Pedido { id: number; tipo: string; mesa?: string | null; mozo?: string | null; estado: string; transcurrido: number; detalles: Detalle[]; }

const DEMORA = 1200;
const fmt = (s: number) => {
  s = Math.max(0, s);
  if (s < 3600) { const m = Math.floor(s / 60), x = s % 60; return `${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}`; }
  if (s < 86400) { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${String(m).padStart(2, '0')}m`; }
  const d = Math.floor(s / 86400); return `hace ${d}d`;
};
const origen = (p: Pedido) => p.tipo === 'dine-in' ? `Mesa ${p.mesa}${p.mozo ? ' · ' + p.mozo : ''}` : (p.tipo === 'delivery' ? 'Delivery · App' : 'Para Llevar · App');

const ESTADO_MSG: Record<string, string> = { en_cocina: 'En preparación', listo: 'Listo', entregado: 'Despachado' };

// Definidos a nivel de módulo: referencias estables → NO se remontan en cada tick (evita el salto de scroll).
const Card: FC<{ p: Pedido; tick: number; accent: string; next?: string; label?: string; icon?: LucideIcon; onAvanzar: (id: number, estado: string) => void }> = ({ p, tick, accent, next, label, icon: Icon, onAvanzar }) => {
  const elapsed = p.transcurrido + tick;
  const over = elapsed >= DEMORA;
  return (
    <article className={`bg-surface rounded-3xl p-5 shadow-md border-l-4 ${accent} border border-outline-variant/20 flex flex-col gap-4 ${over ? 'ring-2 ring-error' : ''}`}>
      <div className="flex justify-between items-start gap-3">
        <div>
          <span className="font-bold text-on-surface text-lg flex items-center gap-2">Orden #{p.id}
            {over && <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1"><AlertTriangle size={12} /> Demorado</span>}
          </span>
          <p className="text-xs text-on-surface-variant">{origen(p)}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${over ? 'text-error bg-error/10' : 'text-secondary bg-secondary-container/20'}`}>
          <Timer size={14} /><span className="text-sm font-bold tabular-nums">{fmt(elapsed)}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2 border-y border-outline-variant/10 py-3">
        {p.detalles?.map((d, i) => (
          <li key={i}>
            <span className="font-semibold text-on-surface text-sm">{d.cantidad}x {d.producto?.nombre}</span>
            {d.notas && <div className="bg-error-container/20 p-2 rounded-lg flex items-start gap-2 mt-1"><AlertCircle className="text-error shrink-0" size={14} /><p className="text-xs text-error font-medium">{d.notas}</p></div>}
          </li>
        ))}
      </ul>
      {next && (
        <button onClick={() => onAvanzar(p.id, next)} className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {Icon && <Icon size={16} />} {label}
        </button>
      )}
    </article>
  );
};

const Col: FC<{ title: string; dot: string; list: Pedido[]; children: (p: Pedido) => any }> = ({ title, dot, list, children }) => (
  <section className="flex flex-col bg-surface-container-low/60 rounded-[2rem] border border-outline-variant/30 shadow-sm overflow-hidden qz-up">
    <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low">
      <h3 className="font-display text-lg text-on-surface flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${dot}`} /> {title}</h3>
      <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full">{list.length}</span>
    </div>
    <div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
      {list.length === 0 && <div className="flex flex-col items-center gap-2 py-12 text-on-surface-variant/70"><Soup size={28} className="opacity-40" /><p className="text-sm">Sin pedidos.</p></div>}
      {list.map(children)}
    </div>
  </section>
);

const KitchenDashboard: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0);

  const load = useCallback(() => { api.get<Pedido[]>('/admin/cocina').then(p => { setPedidos(p); setLoaded(true); }).catch(() => {}); }, []);
  useEffect(() => { if (!authLoading && user) load(); }, [authLoading, user, load]);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 1000); return () => clearInterval(t); }, []);

  if (!authLoading && (!user || !user.paginas?.includes('cocina'))) return <Navigate to="/admin" replace />;

  const avanzar = async (id: number, estado: string) => {
    try {
      await api.post(`/admin/pedidos/${id}/estado`, { estado });
      success(`Pedido actualizado · ${ESTADO_MSG[estado] || estado}`);
      load();
    } catch (e: any) {
      error(e?.message || 'Error');
    }
  };

  const cols: Record<string, Pedido[]> = { pendiente: [], en_cocina: [], listo: [] };
  pedidos.forEach(p => { if (cols[p.estado]) cols[p.estado].push(p); });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <header className="px-10 py-8 flex justify-between items-center border-b border-outline-variant/30 bg-surface/50 backdrop-blur-md qz-up">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><ChefHat size={28} /></span>
            <div>
              <h2 className="font-display text-4xl text-primary">Estación Principal</h2>
              <p className="text-on-surface-variant mt-1">Monitor en vivo · {cols.pendiente.length + cols.en_cocina.length} tickets activos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-high px-6 py-2 rounded-full border border-outline-variant/50"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary" /></span><Clock className="text-tertiary" size={20} /><span className="font-semibold text-on-surface text-sm">Cocina en tiempo real</span></div>
        </header>
        {!loaded ? (
          <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {Array.from({ length: 3 }).map((_, c) => (
              <section key={c} className="flex flex-col bg-surface-container-low/60 rounded-[2rem] border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low"><Skeleton className="h-5 w-40" /><Skeleton className="h-6 w-8 rounded-full" /></div>
                <div className="p-4 flex flex-col gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-surface rounded-3xl p-5 border border-outline-variant/20 flex flex-col gap-4">
                      <div className="flex justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-16 rounded-lg" /></div>
                      <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-11 w-full rounded-full" />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <Col title="Pendientes" dot="bg-secondary" list={cols.pendiente}>{p => <Card key={p.id} p={p} tick={tick} accent="border-l-secondary" next="en_cocina" label="Iniciar Preparación" icon={CookingPot} onAvanzar={avanzar} />}</Col>
            <Col title="En Preparación" dot="bg-tertiary" list={cols.en_cocina}>{p => <Card key={p.id} p={p} tick={tick} accent="border-l-tertiary" next="listo" label="Marcar Listo" icon={CheckCircle2} onAvanzar={avanzar} />}</Col>
            <Col title="Listos para Servir" dot="bg-primary" list={cols.listo}>{p => <Card key={p.id} p={p} tick={tick} accent="border-l-primary" next="entregado" label="Despachar" icon={Soup} onAvanzar={avanzar} />}</Col>
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;
