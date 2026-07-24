import { useEffect, useState, FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Power, Trash2, Shield, Users, UserCog, UserCheck, UserX, Plus, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/Skeleton';

interface Usuario { id: number; name: string; email: string; telefono?: string | null; rol: string; activo: boolean | number; pedidos_count: number; }
interface Data { usuarios: Usuario[]; kpis: { total: number; staff: number; clientes: number; inactivos: number }; perms: Record<string, string>; }

const ROLES = ['cliente', 'admin', 'cajero', 'cocina', 'mesero'];
const rolBadge: Record<string, string> = { admin: 'bg-secondary-container text-on-secondary-container', cajero: 'bg-tertiary-container text-on-tertiary-container', cocina: 'bg-primary-container text-on-primary-container', mesero: 'bg-surface-variant text-on-surface-variant', cliente: 'bg-surface-variant text-on-surface-variant' };

const UsuariosAdmin: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const [d, setD] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [rolf, setRolf] = useState('');
  const [open, setOpen] = useState(false);
  const emptyNuevo = { name: '', email: '', password: '', rol: 'cliente', telefono: '', direccion: '' };
  const [nuevo, setNuevo] = useState(emptyNuevo);

  const load = useCallback(() => {
    const p = new URLSearchParams(); if (q) p.set('q', q); if (rolf) p.set('rolf', rolf);
    api.get<Data>(`/admin/usuarios?${p}`).then(setD).catch(() => {}).finally(() => setLoading(false));
  }, [q, rolf]);
  useEffect(() => { if (!authLoading && user) load(); }, [authLoading, user, load]);

  if (!authLoading && (!user || !user.paginas?.includes('usuarios'))) return <Navigate to="/admin" replace />;

  const setRol = async (id: number, rol: string) => {
    try { await api.post(`/admin/usuarios/${id}/rol`, { rol }); success('Rol actualizado'); load(); }
    catch (e: any) { error(e?.message || 'Ocurrió un error'); }
  };
  const accion = async (id: number, a: string) => {
    if (a === 'del' && !confirm('¿Eliminar usuario?')) return;
    const msgs: Record<string, string> = { del: 'Usuario eliminado', activo: 'Usuario actualizado' };
    try { await api.post(`/admin/usuarios/${id}/${a}`); success(msgs[a] || 'Acción realizada'); load(); }
    catch (e: any) { error(e?.message || 'Ocurrió un error'); }
  };
  const setN = (k: string, v: any) => setNuevo(f => ({ ...f, [k]: v }));
  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/usuarios', { name: nuevo.name, email: nuevo.email, password: nuevo.password, rol: nuevo.rol, telefono: nuevo.telefono, direccion: nuevo.direccion });
      success('Usuario creado');
      setOpen(false); setNuevo(emptyNuevo); load();
    } catch (e: any) { error(e?.message || 'Ocurrió un error'); }
  };
  const inp = "border border-outline-variant rounded-xl px-4 py-2.5 bg-surface focus:ring-2 focus:ring-primary/20 outline-none";
  const inpm = "w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface focus:ring-2 focus:ring-primary/20 outline-none";

  const kpiCards: { label: string; value: number; ring: string; Icon: any }[] = d ? [
    { label: 'Total', value: d.kpis.total, ring: 'bg-primary/10 text-primary', Icon: Users },
    { label: 'Staff', value: d.kpis.staff, ring: 'bg-secondary/10 text-secondary', Icon: UserCog },
    { label: 'Clientes', value: d.kpis.clientes, ring: 'bg-tertiary/10 text-tertiary', Icon: UserCheck },
    { label: 'Inactivos', value: d.kpis.inactivos, ring: 'bg-error/10 text-error', Icon: UserX },
  ] : [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex items-center justify-between gap-4 mb-8 qz-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Users size={26} /></div>
            <div>
              <h1 className="font-display text-4xl text-on-surface">Usuarios</h1>
              <p className="text-on-surface-variant">Gestión de accesos y roles.</p>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-full shadow-md hover:brightness-110 transition"><Plus size={18} /> Nuevo Usuario</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5"><div className="animate-pulse space-y-3"><div className="h-3 w-20 bg-surface-variant/60 rounded" /><div className="h-8 w-16 bg-surface-variant/60 rounded" /></div></div>
            ))}
          </div>
        ) : d && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {kpiCards.map(({ label, value, ring, Icon }, i) => (
                <div key={label} className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-xl shadow-primary/5 qz-up qz-up-${i + 1} qz-hover`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${ring}`}><Icon size={18} /></div>
                  </div>
                  <p className="font-display text-3xl text-on-surface">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 mb-6 shadow-xl shadow-primary/5 qz-up">
              <h3 className="font-display text-lg text-on-surface mb-4 flex items-center gap-2"><Shield size={18} className="text-primary" /> Permisos por rol</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(d.perms).map(([rol, desc]) => (
                  <div key={rol} className="flex items-start gap-3 bg-surface-variant/30 rounded-xl p-3">
                    <span className={`shrink-0 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${rolBadge[rol]}`}>{rol}</span>
                    <p className="text-xs text-on-surface-variant">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 mb-4 max-w-lg">
          <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" /><input className={inp + ' w-full pl-10'} placeholder="Buscar nombre o correo..." value={q} onChange={e => setQ(e.target.value)} /></div>
          <select className={inp} value={rolf} onChange={e => setRolf(e.target.value)}><option value="">Todos</option>{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden qz-up">
          {loading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : d && d.usuarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-variant/40 text-on-surface-variant flex items-center justify-center mb-4"><UserX size={30} /></div>
              <p className="font-display text-lg text-on-surface">Sin usuarios</p>
              <p className="text-sm text-on-surface-variant">No hay usuarios que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-surface-container-low/40 border-b border-outline-variant/30">{['#', 'Nombre', 'Correo', 'Pedidos', 'Rol', 'Estado', 'Acciones'].map(h => <th key={h} className="py-3 px-4 text-xs font-bold text-on-surface-variant uppercase">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-outline-variant/20">
                {d?.usuarios.map(u => {
                  const self = u.id === user?.id;
                  return (
                    <tr key={u.id} className="transition-colors hover:bg-surface-container-low/40">
                      <td className="py-3 px-4 text-on-surface-variant">{u.id}</td>
                      <td className="py-3 px-4 font-semibold text-on-surface">{u.name}{self && <span className="text-[10px] text-primary ml-1">(tú)</span>}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{u.email}</td>
                      <td className="py-3 px-4">{u.pedidos_count}</td>
                      <td className="py-3 px-4">
                        {self ? <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${rolBadge[u.rol]}`}>{u.rol}</span> : (
                          <select value={u.rol} onChange={e => setRol(u.id, e.target.value)} className={`border border-outline-variant/50 rounded-full px-3 py-1 text-xs font-bold capitalize ${rolBadge[u.rol]}`}>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4"><span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${u.activo ? 'bg-primary/10 text-primary' : 'bg-error-container text-on-error-container'}`}>{u.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {self ? <span className="text-on-surface-variant text-xs">—</span> : (
                          <>
                            <button onClick={() => accion(u.id, 'activo')} title="Activar/Desactivar" className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition"><Power size={16} /></button>
                            <button onClick={() => accion(u.id, 'del')} title="Eliminar" className="p-2 rounded-full hover:bg-error-container text-secondary transition"><Trash2 size={16} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <form onSubmit={crear} className="qz-pop relative bg-surface-container-lowest w-full max-w-lg rounded-[2rem] border border-outline-variant/30 shadow-2xl p-8 max-h-[92vh] overflow-y-auto">
              <button type="button" onClick={() => setOpen(false)} className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition"><X size={20} /></button>
              <h2 className="font-display text-2xl text-on-surface mb-6 flex items-center gap-2"><Plus className="text-primary" /> Nuevo Usuario</h2>
              <div className="space-y-4">
                <input className={inpm} placeholder="Nombre" value={nuevo.name} onChange={e => setN('name', e.target.value)} required />
                <input className={inpm} type="email" placeholder="Correo" value={nuevo.email} onChange={e => setN('email', e.target.value)} required />
                <input className={inpm} type="password" minLength={6} placeholder="Contraseña (mín. 6)" value={nuevo.password} onChange={e => setN('password', e.target.value)} required />
                <select className={inpm} value={nuevo.rol} onChange={e => setN('rol', e.target.value)}>{ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}</select>
                <input className={inpm} placeholder="Teléfono" value={nuevo.telefono} onChange={e => setN('telefono', e.target.value)} />
                <input className={inpm} placeholder="Dirección" value={nuevo.direccion} onChange={e => setN('direccion', e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-outline-variant/30">
                <button type="button" onClick={() => setOpen(false)} className="px-5 py-3 rounded-full border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-variant transition">Cancelar</button>
                <button className="bg-primary text-on-primary font-bold px-8 py-3 rounded-full shadow-md hover:brightness-110 transition">Crear usuario</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsuariosAdmin;
