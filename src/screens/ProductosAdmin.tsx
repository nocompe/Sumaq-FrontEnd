import { useEffect, useState, FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Pencil, Trash2, Power, Search, Minus, Save, Package, CheckCircle2, AlertTriangle, XCircle, PackageX, Upload, ImageIcon } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/Skeleton';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;

interface Cat { id: number; nombre: string; }
interface Producto { id: number; categoria_id: number; nombre: string; descripcion?: string; precio: number | string; imagen: string; tag?: string | null; disponible: boolean | number; stock: number; categoria?: Cat; }
interface Data { productos: Producto[]; categorias: Cat[]; kpis: { total: number; disp: number; bajo: number; agot: number }; }

const empty = { id: 0, nombre: '', categoria_id: '', descripcion: '', precio: '', tag: '', imagen: '', stock: '', disponible: true };

const ProductosAdmin: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [d, setD] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [form, setForm] = useState<any>(empty);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    const p = new URLSearchParams();
    if (q) p.set('q', q); if (cat) p.set('cat', cat);
    api.get<Data>(`/admin/productos?${p}`).then(setD).catch(() => {}).finally(() => setLoading(false));
  }, [q, cat]);
  useEffect(() => { if (!authLoading && user) load(); }, [authLoading, user, load]);

  if (!authLoading && (!user || !user.paginas?.includes('productos'))) return <Navigate to="/admin" replace />;

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const subirFoto = async (file: File) => {
    const fd = new FormData(); fd.append('imagen', file);
    setUploading(true);
    try { const r = await api.upload<{ url: string }>('/admin/productos/imagen', fd); set('imagen', r.url); success('Imagen subida'); }
    catch (e: any) { error(e?.message || 'No se pudo subir la imagen'); }
    finally { setUploading(false); }
  };
  const editar = (p: Producto) => setForm({ id: p.id, nombre: p.nombre, categoria_id: p.categoria_id, descripcion: p.descripcion || '', precio: p.precio, tag: p.tag || '', imagen: p.imagen, stock: p.stock, disponible: !!p.disponible });
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const editing = !!form.id;
    try {
      await api.post('/admin/productos', { ...form, id: form.id || undefined });
      success(editing ? 'Producto actualizado' : 'Producto creado');
      setForm(empty); load();
    } catch (e: any) {
      error(e?.message || 'Ocurrió un error');
    }
  };
  const accion = async (id: number, a: string) => {
    if (a === 'del' && !confirm('¿Eliminar este producto?')) return;
    const msgs: Record<string, string> = { del: 'Producto eliminado', toggle: 'Disponibilidad actualizada', inc: 'Stock actualizado', dec: 'Stock actualizado' };
    try {
      await api.post(`/admin/productos/${id}/${a}`);
      success(msgs[a] || 'Acción realizada'); load();
    } catch (e: any) {
      error(e?.message || 'Ocurrió un error');
    }
  };

  const inp = "w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface focus:ring-2 focus:ring-primary/20 outline-none";

  const kpiCards: { label: string; value: number; color: string; ring: string; Icon: any }[] = d ? [
    { label: 'Total', value: d.kpis.total, color: 'text-on-surface', ring: 'bg-primary/10 text-primary', Icon: Package },
    { label: 'Disponibles', value: d.kpis.disp, color: 'text-primary', ring: 'bg-primary/10 text-primary', Icon: CheckCircle2 },
    { label: 'Stock bajo', value: d.kpis.bajo, color: 'text-tertiary', ring: 'bg-tertiary/10 text-tertiary', Icon: AlertTriangle },
    { label: 'Agotados', value: d.kpis.agot, color: 'text-error', ring: 'bg-error/10 text-error', Icon: XCircle },
  ] : [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex items-center gap-4 mb-8 qz-up">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Package size={26} /></div>
          <div>
            <h1 className="font-display text-4xl text-on-surface">Productos</h1>
            <p className="text-on-surface-variant">Inventario y catálogo.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5"><div className="animate-pulse space-y-3"><div className="h-3 w-20 bg-surface-variant/60 rounded" /><div className="h-8 w-16 bg-surface-variant/60 rounded" /></div></div>
            ))}
          </div>
        ) : d && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpiCards.map(({ label, value, color, ring, Icon }, i) => (
              <div key={label} className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5 qz-up qz-up-${i + 1} qz-hover`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${ring}`}><Icon size={18} /></div>
                </div>
                <p className={`font-display text-3xl ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form onSubmit={guardar} className="xl:col-span-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 p-6 space-y-3 self-start qz-up">
            <h3 className="font-display text-xl text-on-surface">{form.id ? 'Editar producto' : 'Nuevo producto'}</h3>
            <input className={inp} placeholder="Nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
            <select className={inp} value={form.categoria_id} onChange={e => set('categoria_id', e.target.value)} required>
              <option value="">— Categoría —</option>
              {d?.categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <textarea className={inp} placeholder="Descripción" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className={inp} type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => set('precio', e.target.value)} />
              <input className={inp} type="number" placeholder="Stock" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
            <input className={inp} placeholder="Tag (ej. Vegano)" value={form.tag} onChange={e => set('tag', e.target.value)} />
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Imagen</label>
              <div className="flex items-center gap-3">
                {form.imagen
                  ? <img src={form.imagen} className="w-16 h-16 rounded-xl object-cover border border-outline-variant shrink-0" alt="" />
                  : <div className="w-16 h-16 rounded-xl bg-surface-variant/40 flex items-center justify-center text-on-surface-variant shrink-0"><ImageIcon size={20} /></div>}
                <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 border border-dashed border-outline-variant rounded-xl px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-variant hover:border-primary transition">
                  <Upload size={16} /> {uploading ? 'Subiendo…' : 'Subir foto'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) subirFoto(f); e.target.value = ''; }} />
                </label>
              </div>
              <input className={inp + ' text-xs'} placeholder="o pega una URL de imagen" value={form.imagen} onChange={e => set('imagen', e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant"><input type="checkbox" className="accent-primary w-4 h-4" checked={form.disponible} onChange={e => set('disponible', e.target.checked)} /> Disponible</label>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition">{form.id ? <><Save size={16} /> Guardar</> : <><Plus size={16} /> Crear</>}</button>
              {form.id ? <button type="button" onClick={() => setForm(empty)} className="px-4 py-2.5 border border-outline-variant rounded-full text-sm font-semibold hover:bg-surface-variant transition">Cancelar</button> : null}
            </div>
          </form>

          <div className="xl:col-span-2 qz-up">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" /><input className={inp + ' pl-10'} placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} /></div>
              <select className={inp + ' w-48'} value={cat} onChange={e => setCat(e.target.value)}><option value="">Todas</option>{d?.categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden">
              {loading ? (
                <TableSkeleton rows={6} cols={5} />
              ) : d && d.productos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface-variant/40 text-on-surface-variant flex items-center justify-center mb-4"><PackageX size={30} /></div>
                  <p className="font-display text-lg text-on-surface">Sin productos</p>
                  <p className="text-sm text-on-surface-variant">No hay productos que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead><tr className="bg-surface-container-low/40 border-b border-outline-variant/30">{['Producto', 'Precio', 'Stock', 'Estado', 'Acciones'].map(h => <th key={h} className="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {d?.productos.map(p => (
                      <tr key={p.id} className={`transition-colors hover:bg-surface-container-low/40 ${p.stock === 0 ? 'bg-error-container/10' : (p.stock < 10 ? 'bg-tertiary-container/10' : '')}`}>
                        <td className="py-3 px-4"><div className="flex items-center gap-3"><img src={p.imagen} className="w-10 h-10 rounded-lg object-cover" alt="" /><div><p className="font-semibold text-on-surface">{p.nombre}</p><p className="text-[10px] text-on-surface-variant uppercase">{p.categoria?.nombre}</p></div></div></td>
                        <td className="py-3 px-4 font-semibold">{soles(p.precio)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => accion(p.id, 'dec')} className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-variant transition"><Minus size={12} /></button>
                            <span className={`w-8 text-center font-bold ${p.stock === 0 ? 'text-error' : p.stock < 10 ? 'text-tertiary' : ''}`}>{p.stock}</span>
                            <button onClick={() => accion(p.id, 'inc')} className="w-6 h-6 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-variant transition"><Plus size={12} /></button>
                          </div>
                        </td>
                        <td className="py-3 px-4"><span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${p.disponible ? 'bg-primary/10 text-primary' : 'bg-error-container text-on-error-container'}`}>{p.disponible ? 'DISPONIBLE' : 'AGOTADO'}</span></td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button onClick={() => accion(p.id, 'toggle')} title="Disponibilidad" className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition"><Power size={16} /></button>
                          <button onClick={() => editar(p)} title="Editar" className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition"><Pencil size={16} /></button>
                          <button onClick={() => accion(p.id, 'del')} title="Eliminar" className="p-2 rounded-full hover:bg-error-container text-secondary transition"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductosAdmin;
