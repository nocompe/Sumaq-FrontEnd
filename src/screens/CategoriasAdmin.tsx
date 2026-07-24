import { useEffect, useState, FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Tags, Plus, Pencil, Trash2, Power, Save } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/Skeleton';

interface Categoria { id: number; nombre: string; descripcion?: string | null; activo: boolean | number; productos_count: number; }
interface Data { categorias: Categoria[]; kpis: { total: number; activas: number }; }
const emptyForm = { id: 0, nombre: '', descripcion: '', activo: true };

const CategoriasAdmin: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [d, setD] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(emptyForm);

  const load = useCallback(() => { api.get<Data>('/admin/categorias').then(setD).catch(() => {}).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!authLoading && user) load(); }, [authLoading, user, load]);

  if (!authLoading && (!user || !user.paginas?.includes('categorias'))) return <Navigate to="/admin" replace />;

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post('/admin/categorias', { ...form, id: form.id || undefined }); success(form.id ? 'Categoría actualizada' : 'Categoría creada'); setForm(emptyForm); load(); }
    catch (err: any) { error(err?.message || 'Error'); }
  };
  const accion = async (id: number, a: string) => {
    if (a === 'del' && !confirm('¿Eliminar esta categoría?')) return;
    try { await api.post(`/admin/categorias/${id}/${a}`); success(a === 'del' ? 'Categoría eliminada' : 'Categoría actualizada'); load(); }
    catch (err: any) { error(err?.message || 'Error'); }
  };
  const inp = "w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface focus:ring-2 focus:ring-primary/20 outline-none";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex items-center gap-4 mb-8 qz-up">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Tags size={26} /></div>
          <div><h1 className="font-display text-4xl text-on-surface">Categorías</h1><p className="text-on-surface-variant">Organiza el menú.</p></div>
        </div>

        {d && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 qz-up">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5"><p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total</p><p className="font-display text-3xl text-on-surface">{d.kpis.total}</p></div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5"><p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Activas</p><p className="font-display text-3xl text-primary">{d.kpis.activas}</p></div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form onSubmit={guardar} className="xl:col-span-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 p-6 space-y-3 self-start qz-up">
            <h3 className="font-display text-xl text-on-surface">{form.id ? 'Editar categoría' : 'Nueva categoría'}</h3>
            <input className={inp} placeholder="Nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
            <textarea className={inp} placeholder="Descripción" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-on-surface-variant"><input type="checkbox" className="accent-primary w-4 h-4" checked={form.activo} onChange={e => set('activo', e.target.checked)} /> Activa</label>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-full flex items-center justify-center gap-2">{form.id ? <><Save size={16} /> Guardar</> : <><Plus size={16} /> Crear</>}</button>
              {form.id ? <button type="button" onClick={() => setForm(emptyForm)} className="px-4 py-2.5 border border-outline-variant rounded-full text-sm font-semibold">Cancelar</button> : null}
            </div>
          </form>

          <div className="xl:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden qz-up">
            {loading ? <TableSkeleton rows={6} cols={4} /> : (
              <table className="w-full text-sm text-left">
                <thead><tr className="bg-surface-container-low/40 border-b border-outline-variant/30">{['Categoría', 'Productos', 'Estado', 'Acciones'].map(h => <th key={h} className="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {d?.categorias.map(c => (
                    <tr key={c.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3 px-4"><p className="font-semibold text-on-surface">{c.nombre}</p>{c.descripcion && <p className="text-xs text-on-surface-variant truncate max-w-[240px]">{c.descripcion}</p>}</td>
                      <td className="py-3 px-4">{c.productos_count}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 text-[10px] font-bold rounded-full ${c.activo ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>{c.activo ? 'ACTIVA' : 'INACTIVA'}</span></td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button onClick={() => accion(c.id, 'toggle')} title="Activar/Desactivar" className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant"><Power size={16} /></button>
                        <button onClick={() => setForm({ id: c.id, nombre: c.nombre, descripcion: c.descripcion || '', activo: !!c.activo })} title="Editar" className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant"><Pencil size={16} /></button>
                        <button onClick={() => accion(c.id, 'del')} title="Eliminar" className="p-2 rounded-lg hover:bg-error-container text-secondary"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {d && d.categorias.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-on-surface-variant">Sin categorías.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriasAdmin;
