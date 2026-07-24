import { useEffect, useState, FC, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, X, Trash2, ClipboardList, Inbox, Table2, LayoutGrid, Filter, Move, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/Skeleton';
import Boleta from '../components/Boleta';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;
const ESTADOS = ['pendiente', 'en_cocina', 'listo', 'entregado', 'cancelado'];
const ESTADO_LABEL: Record<string, string> = { pendiente: 'Pendiente', en_cocina: 'En Cocina', listo: 'Listo', entregado: 'Entregado', cancelado: 'Cancelado' };
const TIPO_LABEL: Record<string, string> = { takeaway: 'Para llevar', 'dine-in': 'En local', delivery: 'Delivery' };
const badge: Record<string, string> = { pendiente: 'bg-tertiary-container text-on-tertiary-container', en_cocina: 'bg-secondary-container text-on-secondary-container', listo: 'bg-primary-container text-on-primary-container', entregado: 'bg-primary/10 text-primary', cancelado: 'bg-error-container text-on-error-container' };
// columnas del tablero kanban (cancelado se maneja desde el selector)
const COLUMNAS = ['pendiente', 'en_cocina', 'listo', 'entregado'] as const;
const COL_COUNT: Record<string, string> = { pendiente: 'bg-tertiary-container text-on-tertiary-container', en_cocina: 'bg-secondary-container text-on-secondary-container', listo: 'bg-primary-container text-on-primary-container', entregado: 'bg-surface-variant text-on-surface-variant' };
const SELECT_COLOR: Record<string, string> = { pendiente: 'bg-tertiary-container text-on-tertiary-container', en_cocina: 'bg-secondary-container text-on-secondary-container', listo: 'bg-primary-container text-on-primary-container', entregado: 'bg-surface-variant text-on-surface-variant', cancelado: 'bg-error-container text-on-error-container' };

const fecha = (s: string) => { const d = new Date(s); const p = (n: number) => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const resumen = (dets: Detalle[]) => dets?.map(x => `${x.cantidad}× ${x.producto?.nombre ?? ''}`).join(', ');

interface Cli { id: number; name: string; }
interface Prod { id: number; nombre: string; precio: number | string; }
interface Detalle { cantidad: number; producto?: { nombre: string }; }
interface Pedido { id: number; tipo: string; mesa?: string | null; estado: string; total: number | string; created_at: string; usuario?: { name: string }; pago?: { estado: string }; detalles: Detalle[]; }
interface Data { pedidos: Pedido[]; clientes: Cli[]; productos: Prod[]; }

const PedidosAdmin: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [d, setD] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [vista, setVista] = useState<'tabla' | 'kanban'>('kanban');
  const [tipoF, setTipoF] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [boleta, setBoleta] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [nuevo, setNuevo] = useState<any>({ user_id: '', tipo: 'takeaway', metodo: 'efectivo', mesa: '', cobrar_ahora: true, lineas: [{ id: '', cantidad: 1, nota: '' }] });

  const load = useCallback(() => { api.get<Data>(`/admin/pedidos${filtro ? `?estado=${filtro}` : ''}`).then(setD).catch(() => {}).finally(() => setLoading(false)); }, [filtro]);
  useEffect(() => { if (!authLoading && user) load(); }, [authLoading, user, load]);

  const pedidos = useMemo(() => (d?.pedidos ?? []).filter(p =>
    (tipoF ? p.tipo === tipoF : true) &&
    (desde ? new Date(p.created_at) >= new Date(desde) : true) &&
    (hasta ? new Date(p.created_at) <= new Date(hasta + 'T23:59:59') : true)
  ), [d, tipoF, desde, hasta]);

  if (!authLoading && (!user || !user.paginas?.includes('pedidos'))) return <Navigate to="/admin" replace />;

  const cambiar = async (id: number, estado: string) => {
    const prev = d;
    // actualización optimista para que arrastrar se sienta instantáneo
    setD(cur => cur ? { ...cur, pedidos: cur.pedidos.map(p => p.id === id ? { ...p, estado } : p) } : cur);
    try { await api.post(`/admin/pedidos/${id}/estado`, { estado }); success('Estado actualizado'); }
    catch (e: any) { setD(prev); error(e?.message || 'Ocurrió un error'); }
  };
  const soltar = (col: string) => { const id = dragId; setDragId(null); setOverCol(null); if (id != null) { const p = d?.pedidos.find(x => x.id === id); if (p && p.estado !== col) cambiar(id, col); } };

  const setN = (k: string, v: any) => setNuevo((f: any) => ({ ...f, [k]: v }));
  const setLinea = (i: number, k: string, v: any) => setNuevo((f: any) => ({ ...f, lineas: f.lineas.map((l: any, j: number) => j === i ? { ...l, [k]: v } : l) }));
  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = nuevo.lineas.filter((l: any) => l.id && l.cantidad > 0).map((l: any) => ({ id: Number(l.id), cantidad: Number(l.cantidad), nota: l.nota }));
    if (!nuevo.user_id || items.length === 0) return;
    try {
      await api.post('/admin/pedidos', { user_id: Number(nuevo.user_id), tipo: nuevo.tipo, metodo: nuevo.metodo, mesa: nuevo.mesa, cobrar_ahora: nuevo.cobrar_ahora, items });
      success('Pedido creado');
      setOpen(false); setNuevo({ user_id: '', tipo: 'takeaway', metodo: 'efectivo', mesa: '', cobrar_ahora: true, lineas: [{ id: '', cantidad: 1, nota: '' }] }); load();
    } catch (e: any) {
      error(e?.message || 'Ocurrió un error');
    }
  };
  const inp = "w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface focus:ring-2 focus:ring-primary/20 outline-none";
  const toggle = (v: 'tabla' | 'kanban') => `inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${vista === v ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-variant'}`;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex items-end justify-between mb-6 qz-up gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><ClipboardList size={26} /></div>
            <div>
              <h1 className="font-display text-4xl text-on-surface">Pedidos</h1>
              <p className="text-on-surface-variant mt-1">{pedidos.length} pedidos.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/50 rounded-full p-1 shadow-sm">
              <button onClick={() => setVista('tabla')} className={toggle('tabla')}><Table2 size={16} /> Tabla</button>
              <button onClick={() => setVista('kanban')} className={toggle('kanban')}><LayoutGrid size={16} /> Kanban</button>
            </div>
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-full shadow-md hover:brightness-110 transition"><Plus size={18} /> Nuevo Pedido</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setFiltro('')} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filtro === '' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Todos</button>
          {ESTADOS.map(es => <button key={es} onClick={() => setFiltro(es)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filtro === es ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>{ESTADO_LABEL[es]}</button>)}
        </div>

        <div className="flex flex-wrap items-end gap-4 mb-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 qz-up">
          <div><label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Tipo</label><select className={inp + ' !w-40'} value={tipoF} onChange={e => setTipoF(e.target.value)}><option value="">Todos</option>{Object.entries(TIPO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          <div><label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Desde</label><input type="date" className={inp + ' !w-44'} value={desde} onChange={e => setDesde(e.target.value)} /></div>
          <div><label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Hasta</label><input type="date" className={inp + ' !w-44'} value={hasta} onChange={e => setHasta(e.target.value)} /></div>
          {(tipoF || desde || hasta) && <button onClick={() => { setTipoF(''); setDesde(''); setHasta(''); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-variant transition"><Filter size={16} /> Limpiar</button>}
        </div>

        {loading ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden qz-up"><TableSkeleton rows={7} cols={7} /></div>
        ) : pedidos.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 flex flex-col items-center justify-center py-20 text-center qz-up">
            <div className="w-16 h-16 rounded-2xl bg-surface-variant/40 text-on-surface-variant flex items-center justify-center mb-4"><Inbox size={30} /></div>
            <p className="font-display text-lg text-on-surface">Sin pedidos</p>
            <p className="text-sm text-on-surface-variant">No hay pedidos para este filtro.</p>
          </div>
        ) : vista === 'tabla' ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden qz-up">
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-surface-container-low/40 border-b border-outline-variant/30">{['Pedido', 'Cliente', 'Items', 'Tipo', 'Total', 'Pago', 'Estado', ''].map((h, i) => <th key={i} className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-outline-variant/20">
                {pedidos.map(p => (
                  <tr key={p.id} className="transition-colors hover:bg-surface-container-low/40 align-top">
                    <td className="py-4 px-6"><span className="font-bold text-on-surface">#{p.id}</span><br /><span className="text-xs text-on-surface-variant">{fecha(p.created_at)}</span></td>
                    <td className="py-4 px-6 font-semibold text-on-surface">{p.usuario?.name}</td>
                    <td className="py-4 px-6 text-xs text-on-surface-variant max-w-[200px]">{p.detalles?.map((x, i) => <div key={i}>{x.cantidad}× {x.producto?.nombre}</div>)}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{TIPO_LABEL[p.tipo] ?? p.tipo}{p.mesa ? ` · Mesa ${p.mesa}` : ''}</td>
                    <td className="py-4 px-6 font-bold text-primary">{soles(p.total)}</td>
                    <td className="py-4 px-6"><span className={`text-xs font-bold ${p.pago?.estado === 'pagado' ? 'text-primary' : 'text-secondary'}`}>{p.pago?.estado ?? '—'}</span></td>
                    <td className="py-4 px-6"><select value={p.estado} onChange={e => cambiar(p.id, e.target.value)} className={`border border-outline-variant/50 rounded-full px-3 py-1.5 text-xs font-bold ${badge[p.estado]}`}>{ESTADOS.map(es => <option key={es} value={es}>{ESTADO_LABEL[es]}</option>)}</select></td>
                    <td className="py-4 px-6"><button onClick={() => setBoleta(p.id)} title="Ver boleta" className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-primary transition"><FileText size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="qz-up">
            <p className="flex items-center gap-2 text-sm text-on-surface-variant mb-4"><Move size={16} /> Arrastra una tarjeta a otra columna para cambiar su estado.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {COLUMNAS.map(col => {
                const items = pedidos.filter(p => p.estado === col);
                return (
                  <div key={col}
                    onDragOver={e => { e.preventDefault(); setOverCol(col); }}
                    onDragLeave={() => setOverCol(c => c === col ? null : c)}
                    onDrop={() => soltar(col)}
                    className={`rounded-2xl border p-3 transition-colors min-h-[200px] ${overCol === col ? 'border-primary bg-primary/5' : 'border-outline-variant/30 bg-surface-container-low/30'}`}>
                    <div className="flex items-center justify-between px-2 py-2 mb-2">
                      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{ESTADO_LABEL[col]}</h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${COL_COUNT[col]}`}>{items.length}</span>
                    </div>
                    <div className="space-y-3">
                      {items.map(p => (
                        <div key={p.id} draggable
                          onDragStart={() => setDragId(p.id)}
                          onDragEnd={() => { setDragId(null); setOverCol(null); }}
                          className={`bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 cursor-grab active:cursor-grabbing qz-hover ${dragId === p.id ? 'opacity-50' : ''}`}>
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-bold text-on-surface">#{p.id}</span>
                            <span className="font-display font-bold text-primary">{soles(p.total)}</span>
                          </div>
                          <p className="font-semibold text-on-surface text-[15px] mb-1">{p.usuario?.name}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{resumen(p.detalles)}</p>
                          <div className="flex items-center flex-wrap gap-2 mb-3">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-variant/60 text-on-surface-variant">{TIPO_LABEL[p.tipo] ?? p.tipo}</span>
                            {p.mesa && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">Mesa {p.mesa}</span>}
                            <span className="ml-auto text-[11px] text-on-surface-variant">{fecha(p.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select value={p.estado} onChange={e => cambiar(p.id, e.target.value)} className={`flex-1 border border-outline-variant/40 rounded-lg px-3 py-2 text-xs font-bold outline-none ${SELECT_COLOR[p.estado]}`}>
                              {ESTADOS.map(es => <option key={es} value={es}>{ESTADO_LABEL[es]}</option>)}
                            </select>
                            <button onClick={() => setBoleta(p.id)} title="Ver boleta" className="shrink-0 p-2 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-variant hover:text-primary transition"><FileText size={15} /></button>
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && <p className="text-center text-xs text-on-surface-variant/60 py-6">Vacío</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <form onSubmit={crear} className="qz-pop relative bg-surface-container-lowest w-full max-w-2xl rounded-[2rem] border border-outline-variant/30 shadow-2xl p-8 max-h-[92vh] overflow-y-auto">
              <button type="button" onClick={() => setOpen(false)} className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition"><X size={20} /></button>
              <h2 className="font-display text-2xl text-on-surface mb-6 flex items-center gap-2"><Plus className="text-primary" /> Nuevo Pedido</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <select className={inp} value={nuevo.user_id} onChange={e => setN('user_id', e.target.value)} required><option value="">— Cliente —</option>{d?.clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select className={inp} value={nuevo.tipo} onChange={e => setN('tipo', e.target.value)}><option value="takeaway">Para llevar</option><option value="dine-in">En local</option><option value="delivery">Delivery</option></select>
                {nuevo.tipo === 'dine-in' && <input className={inp} placeholder="Mesa" value={nuevo.mesa} onChange={e => setN('mesa', e.target.value)} />}
                <select className={inp} value={nuevo.metodo} onChange={e => setN('metodo', e.target.value)}><option value="efectivo">Efectivo</option><option value="tarjeta">Tarjeta</option><option value="yape">Yape / Plin</option></select>
              </div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Productos</label>
              <div className="space-y-2 mb-3">
                {nuevo.lineas.map((l: any, i: number) => (
                  <div key={i} className="flex flex-wrap gap-2">
                    <select className={inp + ' flex-1 min-w-[10rem]'} value={l.id} onChange={e => setLinea(i, 'id', e.target.value)}><option value="">— Producto —</option>{d?.productos.map(p => <option key={p.id} value={p.id}>{p.nombre} — {soles(p.precio)}</option>)}</select>
                    <input type="number" min={1} className={inp + ' w-20'} value={l.cantidad} onChange={e => setLinea(i, 'cantidad', e.target.value)} />
                    <input className={inp + ' flex-1 min-w-[10rem] basis-full'} placeholder="Nota (ej. sin sal)" value={l.nota} onChange={e => setLinea(i, 'nota', e.target.value)} />
                    {nuevo.lineas.length > 1 && <button type="button" onClick={() => setN('lineas', nuevo.lineas.filter((_: any, j: number) => j !== i))} className="p-2.5 rounded-xl text-on-surface-variant hover:bg-error-container hover:text-error transition"><Trash2 size={16} /></button>}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setN('lineas', [...nuevo.lineas, { id: '', cantidad: 1, nota: '' }])} className="text-primary font-semibold text-sm inline-flex items-center gap-1 mb-4"><Plus size={16} /> Agregar producto</button>
              <label className="flex items-center gap-3 bg-surface-container-low/60 rounded-xl px-4 py-3 mb-4"><input type="checkbox" checked={nuevo.cobrar_ahora} onChange={e => setN('cobrar_ahora', e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm font-semibold text-on-surface">Cobrar ahora (suma a Ventas Hoy)</span></label>
              <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant/30">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-3 rounded-full border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-variant transition">Cancelar</button>
                <button className="bg-primary text-on-primary font-bold px-8 py-3 rounded-full shadow-md hover:brightness-110 transition">Crear pedido</button>
              </div>
            </form>
          </div>
        )}

        {boleta !== null && <Boleta pedidoId={boleta} onClose={() => setBoleta(null)} />}
      </main>
    </div>
  );
};

export default PedidosAdmin;
