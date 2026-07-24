import { useState, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, CreditCard, Lock, Smartphone, Banknote, ShieldCheck, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const soles = (n: number) => `S/ ${Number(n).toFixed(2)}`;
const ENVIO = 8;

const CheckoutPage: FC = () => {
  const { items, total, clear, setNota } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<'takeaway' | 'delivery' | 'dine-in'>('takeaway');
  const [metodo, setMetodo] = useState<'tarjeta' | 'yape' | 'efectivo'>('tarjeta');
  const [direccion, setDireccion] = useState(user?.direccion || '');
  const [mesa, setMesa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center">
        <p className="text-on-surface-variant mb-6">Inicia sesión para completar tu pedido.</p>
        <Link to="/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-full">Ingresar</Link>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center">
        <p className="text-on-surface-variant mb-6">Tu carrito está vacío.</p>
        <Link to="/menu" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-full">Ver el menú</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const pedido = await api.post('/pedidos', {
        items: items.map(i => ({ id: i.id, cantidad: i.cantidad, nota: i.nota || null })),
        tipo, metodo, direccion, mesa,
      });
      clear();
      navigate('/confirmation', { state: { pedido } });
    } catch (err: any) {
      setError(err?.message || 'No se pudo procesar el pedido.');
    } finally { setLoading(false); }
  };

  return (
    <div className="pt-28 pb-24 px-8 max-w-7xl mx-auto w-full">
      <Link to="/menu" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm mb-6"><ArrowLeft size={16} /> Volver al menú</Link>
      <h1 className="font-display text-4xl text-on-surface mb-8">Completar Pedido</h1>
      {error && <div className="bg-error-container text-on-error-container text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <section className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 p-10">
            <h2 className="font-display text-2xl text-on-surface flex items-center gap-3 mb-8"><User className="text-primary" /> Datos de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Nombre</label>
                <input value={user.name} readOnly className="bg-surface border border-outline-variant rounded-xl px-4 py-3 text-on-surface-variant" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tipo de pedido</label>
                <select value={tipo} onChange={e => setTipo(e.target.value as any)} className="bg-surface border border-outline-variant rounded-xl px-4 py-3">
                  <option value="takeaway">Para llevar</option>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">En local</option>
                </select>
              </div>
              {tipo === 'delivery' && (
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Dirección</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                    <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle, número, distrito" className="w-full bg-surface border border-outline-variant rounded-xl px-12 py-3" />
                  </div>
                </div>
              )}
              {tipo === 'dine-in' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Mesa</label>
                  <input value={mesa} onChange={e => setMesa(e.target.value)} placeholder="Ej. 04" className="bg-surface border border-outline-variant rounded-xl px-4 py-3" />
                </div>
              )}
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 p-10">
            <h2 className="font-display text-2xl text-on-surface flex items-center gap-3 mb-8"><CreditCard className="text-primary" /> Método de Pago</h2>
            <div className="grid grid-cols-3 gap-4">
              {([['tarjeta', CreditCard], ['yape', Smartphone], ['efectivo', Banknote]] as const).map(([m, Icon]) => (
                <button type="button" key={m} onClick={() => setMetodo(m)} className={cn("border-2 rounded-2xl p-5 text-center transition-all", metodo === m ? "border-primary bg-primary/5" : "border-outline-variant/30")}>
                  <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="font-semibold capitalize">{m}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 p-8 sticky top-28">
            <h3 className="font-display text-2xl text-on-surface mb-6">Resumen</h3>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
              {items.map(it => (
                <div key={it.id}>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">{it.cantidad}× {it.nombre}</span><span className="font-semibold">{soles(it.precio * it.cantidad)}</span></div>
                  <input value={it.nota || ''} onChange={e => setNota(it.id, e.target.value)} placeholder="Nota (ej. sin sal, sin cebolla…)"
                         className="mt-1.5 w-full bg-surface border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant/30 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-on-surface-variant"><span>Subtotal</span><span>{soles(total)}</span></div>
              <div className="flex justify-between text-sm text-on-surface-variant"><span>Envío</span><span>{soles(ENVIO)}</span></div>
              <div className="flex justify-between items-center pt-2"><span className="font-display text-2xl font-bold">Total</span><span className="font-display text-2xl font-bold text-primary">{soles(total + ENVIO)}</span></div>
            </div>
            <button disabled={loading} className="w-full bg-primary text-on-primary font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition disabled:opacity-60">
              <Lock size={18} /> {loading ? 'Procesando…' : 'Confirmar Pago'}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <ShieldCheck size={14} className="text-primary" /> Pago 100% seguro
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
