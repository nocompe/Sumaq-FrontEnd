import { useState, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const LoginPage: FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '', telefono: '', direccion: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (mode === 'login') {
        user = await login(form.email, form.password);
      } else {
        if (form.password !== form.password2) throw new Error('Las contraseñas no coinciden.');
        if (form.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
        user = await register({ name: form.name, email: form.email, password: form.password, telefono: form.telefono, direccion: form.direccion });
      }
      navigate(user.es_staff ? '/admin' : '/menu');
    } catch (err: any) {
      setError(err?.message || 'No se pudo completar la operación.');
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-28">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-3xl font-bold text-primary mb-8" style={{ fontFamily: 'Geist, sans-serif' }}>
          Sumaq
        </Link>
        <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 p-8 sm:p-10">
          <div className="flex gap-2 mb-8 bg-surface-variant/40 p-1 rounded-full">
            <button onClick={() => setMode('login')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'login' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant'}`}>Ingresar</button>
            <button onClick={() => setMode('register')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'register' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant'}`}>Crear cuenta</button>
          </div>

          {error && <div className="bg-error-container text-on-error-container text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <input className={input} placeholder="Nombre completo" value={form.name} onChange={e => set('name', e.target.value)} required />
            )}
            <input className={input} type="email" placeholder="Correo" value={form.email} onChange={e => set('email', e.target.value)} required />
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <input className={input} placeholder="Teléfono" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
                <input className={input} placeholder="Dirección" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
              </div>
            )}
            <input className={input} type="password" placeholder="Contraseña" value={form.password} onChange={e => set('password', e.target.value)} required />
            {mode === 'register' && (
              <input className={input} type="password" placeholder="Repetir contraseña" value={form.password2} onChange={e => set('password2', e.target.value)} required />
            )}
            <button disabled={loading} className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {mode === 'login' ? <><LogIn size={18} /> Ingresar</> : <><UserPlus size={18} /> Registrarme</>}
            </button>
          </form>

          <div className="bg-surface-variant/40 rounded-2xl p-3 mt-6 text-xs text-on-surface-variant text-center leading-relaxed">
            Demo (contraseña <b>sumaq2026</b>)<br />
            admin · cliente · cajero · cocina · mesero <span className="opacity-70">@sumaq.pe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
