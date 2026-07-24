import { useEffect, useState, FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Banknote, CreditCard, Smartphone, Wallet, Calculator, Coins, TrendingUp, FileText, CalendarDays, CalendarRange } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';
import Boleta from '../components/Boleta';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;

interface Metodo { metodo: string; t: number; n: number; }
interface Pago { id: number; metodo: string; monto: number; estado: string; referencia?: string; pedido?: { id: number; usuario?: { name: string } }; }
interface Dia { label: string; val: number; hoy: boolean; }
interface CajaData {
  hoy: number; semana: number; mes: number; nSemana: number; nMes: number;
  porDia: Dia[]; porCobrar: number; porMetodo: Metodo[]; filtro: string; pagos: Pago[];
}

const metIcon: Record<string, any> = { efectivo: Banknote, tarjeta: CreditCard, yape: Smartphone };

const CashierDashboard: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [d, setD] = useState<CajaData | null>(null);
  const [filtro, setFiltro] = useState('pendiente');
  const [boleta, setBoleta] = useState<number | null>(null);

  const load = useCallback((f: string) => { api.get<CajaData>(`/admin/caja?f=${f}`).then(setD).catch(() => {}); }, []);
  useEffect(() => { if (!authLoading && user) load(filtro); }, [authLoading, user, filtro, load]);

  if (!authLoading && (!user || !user.paginas?.includes('caja'))) return <Navigate to="/admin" replace />;

  const accion = async (id: number, a: 'cobrar' | 'anular') => {
    try {
      await api.post(`/admin/pagos/${id}/${a}`);
      success(a === 'cobrar' ? 'Pago cobrado' : 'Pago anulado');
      load(filtro);
    } catch (e: any) {
      error(e?.message || 'Error');
    }
  };
  const efectivoHoy = d?.porMetodo.find(m => m.metodo === 'efectivo')?.t ?? 0;
  const totMet = Math.max(1, (d?.porMetodo.reduce((a, m) => a + Number(m.t), 0) ?? 0));
  const iniciales = (n?: string) => (n || '?').split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-8 flex items-center gap-4 qz-up">
          <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Coins size={28} /></span>
          <div><h2 className="font-display text-4xl text-on-surface">Caja y Entregas</h2><p className="text-on-surface-variant mt-1">Arqueo del turno y cobros.</p></div>
        </header>

        {!d ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5">
                  <Skeleton className="h-3 w-24 mb-3" /><Skeleton className="h-9 w-32" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-6">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}</div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 px-2 border-b border-outline-variant/10 last:border-0">
                  <Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-12" /><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-7 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <section className="mb-8 bg-surface-container-low rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-up">
              <div className="flex items-center gap-3 mb-8"><span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Calculator size={24} /></span><div><h3 className="font-display text-2xl text-on-surface">Arqueo de Caja</h3><p className="text-xs text-on-surface-variant">Resumen del turno · hoy</p></div></div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 qz-hover"><div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cobrado hoy</p><TrendingUp size={18} className="text-primary" /></div><p className="font-display text-3xl text-primary">{soles(d.hoy)}</p></div>
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 qz-hover"><div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Esta semana</p><CalendarDays size={18} className="text-primary" /></div><p className="font-display text-3xl text-on-surface">{soles(d.semana)}</p><span className="text-[11px] text-on-surface-variant">{d.nSemana} cobros</span></div>
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 qz-hover"><div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Este mes</p><CalendarRange size={18} className="text-primary" /></div><p className="font-display text-3xl text-on-surface">{soles(d.mes)}</p><span className="text-[11px] text-on-surface-variant">{d.nMes} cobros</span></div>
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 qz-hover"><div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Por cobrar</p><Wallet size={18} className="text-secondary" /></div><p className="font-display text-3xl text-secondary">{soles(d.porCobrar)}</p></div>
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 qz-hover"><div className="flex items-center justify-between mb-1"><p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Efectivo esperado</p><Banknote size={18} className="text-tertiary" /></div><p className="font-display text-3xl text-on-surface">{soles(efectivoHoy)}</p></div>
              </div>

              {/* Cobrado por día de la semana en curso */}
              <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display text-lg text-on-surface flex items-center gap-2"><CalendarDays size={18} className="text-primary" /> Cobrado por día · semana en curso</h4>
                  <span className="text-xs font-semibold text-on-surface-variant">Total {soles(d.semana)}</span>
                </div>
                <div className="flex items-end justify-between gap-3 h-40">
                  {d.porDia?.map((dia, i) => {
                    const max = Math.max(1, ...d.porDia.map(x => Number(x.val)));
                    const h = Math.round((Number(dia.val) / max) * 120);
                    return (
                      <div key={i} className="group flex-1 h-full flex flex-col items-center justify-end gap-2">
                        <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">{soles(dia.val)}</span>
                        <div className={`w-full max-w-[46px] rounded-t-lg transition-all ${dia.hoy ? 'bg-primary' : Number(dia.val) > 0 ? 'bg-primary/45' : 'bg-surface-variant'}`} style={{ height: `${Math.max(4, h)}px` }} />
                        <span className={`text-[11px] font-bold ${dia.hoy ? 'text-primary' : 'text-on-surface-variant'}`}>{dia.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['efectivo', 'tarjeta', 'yape'] as const).map(m => {
                  const row = d.porMetodo.find(x => x.metodo === m); const Icon = metIcon[m]; const val = Number(row?.t ?? 0);
                  return (
                    <div key={m} className="bg-surface rounded-2xl p-5 border border-outline-variant/20">
                      <div className="flex items-center justify-between mb-2"><span className="flex items-center gap-2 font-semibold text-on-surface capitalize"><Icon size={16} className="text-primary" /> {m === 'yape' ? 'Yape/Plin' : m}</span><span className="text-xs text-on-surface-variant">{row?.n ?? 0}</span></div>
                      <p className="font-display text-xl text-on-surface mb-2">{soles(val)}</p>
                      <div className="h-2 bg-surface-variant/50 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(val / totMet * 100)}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex gap-2 mb-6">
              {['pendiente', 'pagado', 'anulado'].map(f => (
                <button key={f} onClick={() => setFiltro(f)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${filtro === f ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'}`}>{f}</button>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden qz-up">
              <table className="w-full text-sm text-left">
                <thead><tr className="bg-surface-container-low/30 border-b border-outline-variant/30">
                  {['Referencia', 'Pedido', 'Cliente', 'Método', 'Monto', 'Estado', 'Acción'].map(h => <th key={h} className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {d.pagos.map(pg => { const Icon = metIcon[pg.metodo] || Wallet; return (
                    <tr key={pg.id} className="hover:bg-surface-container-low/40">
                      <td className="py-4 px-6 font-mono text-xs">{pg.referencia}</td>
                      <td className="py-4 px-6 font-bold">#{pg.pedido?.id}</td>
                      <td className="py-4 px-6"><div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">{iniciales(pg.pedido?.usuario?.name)}</span>{pg.pedido?.usuario?.name}</div></td>
                      <td className="py-4 px-6"><span className="inline-flex items-center gap-1 text-on-surface-variant capitalize"><Icon size={14} /> {pg.metodo}</span></td>
                      <td className="py-4 px-6 font-bold text-primary">{soles(pg.monto)}</td>
                      <td className="py-4 px-6"><span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${pg.estado === 'pagado' ? 'bg-primary/10 text-primary' : pg.estado === 'pendiente' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'}`}>{pg.estado}</span></td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {pg.estado === 'pendiente' && (
                            <>
                              <button onClick={() => accion(pg.id, 'cobrar')} className="bg-primary text-on-primary text-xs font-bold py-1.5 px-4 rounded-full">Cobrar</button>
                              <button onClick={() => { if (confirm('¿Anular este pago?')) accion(pg.id, 'anular'); }} className="text-secondary text-xs font-bold py-1.5 px-3">Anular</button>
                            </>
                          )}
                          {pg.pedido?.id && <button onClick={() => setBoleta(pg.pedido!.id)} title="Ver boleta" className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-primary transition"><FileText size={16} /></button>}
                        </div>
                      </td>
                    </tr>
                  ); })}
                  {d.pagos.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-on-surface-variant">Sin pagos para este filtro.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {boleta !== null && <Boleta pedidoId={boleta} onClose={() => setBoleta(null)} />}
      </main>
    </div>
  );
};

export default CashierDashboard;
