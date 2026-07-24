import { useState, FC } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, Save } from 'lucide-react';

// Formulario de perfil reutilizable (cliente y admin comparten la misma lógica).
const ProfileForm: FC = () => {
  const { user, updateUser } = useAuth();
  const { success } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', telefono: user?.telefono || '', direccion: user?.direccion || '', current_password: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
  const err = (k: string) => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setMsg(''); setLoading(true);
    try {
      const r = await api.post<{ user: any }>('/perfil', form);
      updateUser(r.user);
      setForm(f => ({ ...f, current_password: '', password: '', password_confirmation: '' }));
      success('Perfil actualizado correctamente');
    } catch (e: any) {
      if (e?.status === 422 && e.data?.errors) setErrors(e.data.errors);
      setMsg(e?.message || 'No se pudo guardar.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      {msg && <div className="bg-error-container text-on-error-container text-sm rounded-xl px-4 py-3">{msg}</div>}

      <section className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 p-8">
        <h2 className="font-display text-2xl text-on-surface flex items-center gap-3 mb-6"><User className="text-primary" /> Datos personales</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Nombre</label>
            <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} required />
            {err('name') && <p className="text-xs text-error mt-1">{err('name')}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Teléfono</label><input className={inp} value={form.telefono} onChange={e => set('telefono', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Dirección</label><input className={inp} value={form.direccion} onChange={e => set('direccion', e.target.value)} /></div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 p-8">
        <h2 className="font-display text-2xl text-on-surface flex items-center gap-3 mb-2"><Lock className="text-primary" /> Cambiar contraseña</h2>
        <p className="text-sm text-on-surface-variant mb-6">Déjalo en blanco si no quieres cambiarla.</p>
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Contraseña actual</label><input type="password" className={inp} value={form.current_password} onChange={e => set('current_password', e.target.value)} />{err('current_password') && <p className="text-xs text-error mt-1">{err('current_password')}</p>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Nueva contraseña</label><input type="password" className={inp} value={form.password} onChange={e => set('password', e.target.value)} />{err('password') && <p className="text-xs text-error mt-1">{err('password')}</p>}</div>
            <div><label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Repetir contraseña</label><input type="password" className={inp} value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} /></div>
          </div>
        </div>
      </section>

      <button disabled={loading} className="bg-primary text-on-primary font-bold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition disabled:opacity-60">
        <Save size={18} /> {loading ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  );
};

export default ProfileForm;
