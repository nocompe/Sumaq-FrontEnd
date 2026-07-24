import { useEffect, useState, FC } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  CircleDollarSign, Receipt, TrendingUp, Users, Clock, CookingPot, Check, CheckCircle, X,
  Wallet, AlertTriangle, ChevronRight, PieChart as PieIcon, BarChart3, LucideIcon,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;
const IMG_FALLBACK = "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2748%27%20height%3D%2748%27%3E%3Crect%20width%3D%2748%27%20height%3D%2748%27%20fill%3D%27%23e2e8f0%27/%3E%3C/svg%3E";

const ORDEN_ESTADOS = ['pendiente', 'en_cocina', 'listo', 'entregado', 'cancelado'];
const ESTADO_LABEL: Record<string, string> = { pendiente: 'Pendiente', en_cocina: 'En cocina', listo: 'Listo', entregado: 'Entregado', cancelado: 'Cancelado' };
const ESTADO_COLOR: Record<string, string> = { pendiente: '#f59e0b', en_cocina: '#0ea5e9', listo: '#86efac', entregado: '#16a34a', cancelado: '#dc2626' };
const ESTADO_META: Record<string, [LucideIcon, string, string]> = {
  pendiente: [Clock, 'text-tertiary', 'bg-tertiary/10'],
  en_cocina: [CookingPot, 'text-secondary', 'bg-secondary/10'],
  listo: [Check, 'text-primary', 'bg-primary/10'],
  entregado: [CheckCircle, 'text-primary', 'bg-primary/10'],
  cancelado: [X, 'text-error', 'bg-error/10'],
};
const MEDAL: Record<number, string> = {
  1: 'bg-tertiary/20 text-tertiary ring-tertiary/50',
  2: 'bg-surface-variant text-on-surface-variant ring-outline',
  3: 'bg-tertiary-container/70 text-on-tertiary-container ring-tertiary/30',
};

interface Top { nombre: string; imagen: string; qty: number; monto: number; }
interface Reciente { id: number; estado: string; cliente: string; fecha: string; }
interface Stock { id: number; nombre: string; stock: number; imagen: string; }
interface Dash {
  ventasHoy: number; ingresos: number; nPedidos: number; ticket: number; nClientes: number;
  bars: { label: string; full: string; val: number }[]; maxBar: number;
  top: Top[]; porEstado: Record<string, number>; stockBajo: Stock[]; nStockBajo: number;
  recientes: Reciente[]; metodosHoy: Record<string, number>;
}

const tooltipStyle = { borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,.08)', fontSize: 12 } as const;

const AdminDashboard: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [d, setD] = useState<Dash | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    api.get<Dash>('/admin/dashboard').then(setD).catch(() => {}).finally(() => setLoading(false));
  }, [user, authLoading]);

  if (!authLoading && (!user || !user.es_staff)) return <Navigate to="/login" replace />;

  const estadoData = d ? ORDEN_ESTADOS.map(es => ({ name: ESTADO_LABEL[es], value: d.porEstado?.[es] ?? 0, color: ESTADO_COLOR[es] })).filter(x => x.value > 0) : [];
  const totalPedidos = estadoData.reduce((a, x) => a + x.value, 0);
  const metodoData = d ? [
    { name: 'Efectivo', value: d.metodosHoy.efectivo ?? 0, color: '#16a34a' },
    { name: 'Tarjeta', value: d.metodosHoy.tarjeta ?? 0, color: '#0ea5e9' },
    { name: 'Yape/Plin', value: d.metodosHoy.yape ?? 0, color: '#f59e0b' },
  ] : [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-12 bg-background/50">
        <header className="flex justify-between items-end mb-10 qz-up">
          <div>
            <h2 className="font-display text-4xl text-on-surface mb-1">Vista General</h2>
            <p className="text-on-surface-variant">Resumen de operaciones del día.</p>
          </div>
        </header>

        {loading || !d ? <p className="text-on-surface-variant">Cargando…</p> : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {([
                [CircleDollarSign, 'bg-primary-container/20', 'text-primary', 'Ventas Hoy', soles(d.ventasHoy)],
                [Receipt, 'bg-secondary-container/40', 'text-secondary', 'Pedidos Totales', d.nPedidos],
                [TrendingUp, 'bg-tertiary-container/40', 'text-tertiary', 'Ticket Promedio', soles(d.ticket)],
                [Users, 'bg-primary/10', 'text-primary', 'Clientes', d.nClientes],
              ] as [LucideIcon, string, string, string, string | number][]).map(([Icon, bg, tc, label, val], i) => (
                <div key={i} className={`glass-card rounded-2xl p-6 flex flex-col h-36 qz-up qz-up-${i + 1} qz-hover`}>
                  <div className={`p-2.5 ${bg} rounded-xl ${tc} w-fit`}><Icon className="w-5 h-5" /></div>
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-on-surface-variant mb-1">{label}</p>
                    <h3 className="font-display text-3xl text-on-surface">{val}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingresos (área) + Pedidos por estado (dona) */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-8 h-[380px] flex flex-col qz-up">
                <h3 className="font-display text-2xl text-on-surface mb-6 flex items-center gap-2"><BarChart3 size={20} className="text-primary" /> Ingresos Semanales</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={d.bars} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 } as any} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 } as any} width={56} tickFormatter={(v: any) => `S/${v}`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [soles(v), 'Ingresos']} labelFormatter={(_l: any, p: any) => p?.[0]?.payload?.full ?? ''} />
                      <Area type="monotone" dataKey="val" stroke="#16a34a" strokeWidth={2.5} fill="url(#incGrad)" dot={{ r: 3, fill: '#16a34a' }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 h-[380px] flex flex-col qz-up">
                <h3 className="font-display text-2xl text-on-surface mb-2 flex items-center gap-2"><PieIcon size={20} className="text-primary" /> Pedidos por Estado</h3>
                <div className="flex-1 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={estadoData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3} stroke="none">
                        {estadoData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: any) => [v, n]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-28px' }}>
                    <span className="font-display text-3xl text-on-surface leading-none">{totalPedidos}</span>
                    <span className="text-[11px] font-semibold text-on-surface-variant">pedidos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platos estrella + Métodos de pago (barras) + Actividad reciente */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 qz-up">
                <h3 className="font-display text-2xl text-on-surface mb-6">Platos Estrella</h3>
                <div className="space-y-4">
                  {d.top.slice(0, 5).map((t, idx) => {
                    const rank = idx + 1;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <img src={t.imagen} alt={t.nombre} onError={e => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = IMG_FALLBACK; }} className="w-11 h-11 rounded-lg object-cover border border-outline-variant bg-surface-variant" />
                            <span className={`absolute -top-2 -left-2 w-5 h-5 rounded-full ring-2 flex items-center justify-center text-[10px] font-bold ${MEDAL[rank] ?? 'bg-surface-variant text-on-surface-variant ring-outline'}`}>{rank}</span>
                          </div>
                          <div className="min-w-0"><p className="font-semibold text-on-surface text-sm truncate">{t.nombre}</p><p className="text-xs text-on-surface-variant">{Number(t.qty)} pedidos</p></div>
                        </div>
                        <span className="font-display font-bold text-primary shrink-0">{soles(t.monto)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 h-[360px] flex flex-col qz-up">
                <h3 className="font-display text-2xl text-on-surface mb-2 flex items-center gap-2"><Wallet size={20} className="text-primary" /> Métodos de Pago · Hoy</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metodoData} margin={{ top: 16, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 } as any} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 } as any} width={56} tickFormatter={(v: any) => `S/${v}`} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148,163,184,.08)' }} formatter={(v: any) => [soles(v), 'Cobrado']} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={46}>
                        {metodoData.map((m, i) => <Cell key={i} fill={m.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 qz-up">
                <h3 className="font-display text-2xl text-on-surface mb-6">Actividad Reciente</h3>
                <div className="max-h-64 overflow-y-auto -mr-2 pr-2 space-y-1.5">
                  {d.recientes.map(r => {
                    const [Icon, tc, bg] = ESTADO_META[r.estado] ?? [CheckCircle, 'text-on-surface-variant', 'bg-surface-variant'];
                    return (
                      <Link key={r.id} to="/admin/pedidos" className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-variant/40 transition-colors">
                        <span className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${tc} ${bg}`}><Icon className="w-[18px] h-[18px]" /></span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-on-surface text-sm truncate">Pedido #{r.id} · {r.cliente}</p>
                          <p className="text-xs text-on-surface-variant">{r.fecha} · {r.estado.replace('_', ' ')}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-outline group-hover:text-on-surface-variant transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stock bajo (ancho completo) */}
            <div className="glass-card rounded-2xl p-8 qz-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl text-on-surface flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-tertiary" /> Stock Bajo</h3>
                <Link to="/admin/productos" className="text-xs font-semibold text-primary hover:underline">{d.nStockBajo} en total</Link>
              </div>
              {d.stockBajo.length === 0 ? (
                <p className="text-sm text-on-surface-variant py-6 text-center">Todo con stock suficiente.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {d.stockBajo.map(s => (
                    <Link key={s.id} to="/admin/productos" className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 hover:bg-surface-variant/60 transition-colors">
                      <img src={s.imagen} alt="" className="w-9 h-9 rounded-lg object-cover border border-outline-variant shrink-0" />
                      <span className="flex-1 text-sm font-semibold text-on-surface truncate">{s.nombre}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.stock === 0 ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>{s.stock} u.</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
