import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ArrowRight, Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const soles = (n: number) => `S/ ${Number(n).toFixed(2)}`;

const CarritoPage: FC = () => {
  const { items, inc, dec, remove, clear, count, total } = useCart();

  return (
    <div className="pt-28 pb-16 px-8 max-w-7xl mx-auto w-full min-h-screen bg-surface">
      <Link to="/menu" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Menú
      </Link>

      <div className="mb-10 flex items-center gap-3 qz-up">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <h1 className="font-display text-4xl text-on-surface leading-tight">Tu Pedido</h1>
        {count > 0 && <span className="ml-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{count} items</span>}
      </div>

      {items.length === 0 ? (
        <div className="card rounded-[2rem] p-16 text-center flex flex-col items-center qz-up">
          <ShoppingCart className="w-14 h-14 mb-5 text-on-surface-variant/40" />
          <p className="font-display text-2xl text-on-surface mb-2">Tu carrito está vacío</p>
          <p className="text-on-surface-variant mb-8">Agrega platos saludables desde nuestro menú.</p>
          <Link to="/menu" className="bg-primary text-on-primary font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all">
            Ver el menú <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {items.map(it => (
              <div key={it.id} className="bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-xl shadow-primary/5 p-4 flex items-center gap-4 qz-up">
                <img src={it.imagen} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-outline-variant/20" alt={it.nombre} />
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-on-surface truncate">{it.nombre}</h3>
                  <span className="text-sm text-on-surface-variant">{soles(it.precio)} c/u</span>
                  {it.nota && <p className="text-xs text-on-surface-variant/80 italic mt-0.5 truncate">“{it.nota}”</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => dec(it.id)} className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-on-surface w-5 text-center">{it.cantidad}</span>
                  <button onClick={() => inc(it.id)} className="w-8 h-8 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="w-24 text-right font-display font-bold text-primary">{soles(it.precio * it.cantidad)}</div>
                <button onClick={() => remove(it.id)} className="text-outline hover:text-error p-2 transition-colors" title="Quitar"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={clear} className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-error mt-2 transition-colors"><X className="w-4 h-4" /> Vaciar carrito</button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface-container-low rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden sticky top-28 qz-up">
              <div className="p-6 border-b border-outline-variant/20 bg-surface-container-highest/40">
                <h3 className="font-display text-2xl text-on-surface">Resumen</h3>
              </div>
              <div className="p-8">
                <div className="flex justify-between mb-2 text-sm font-semibold text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{soles(total)}</span>
                </div>
                <div className="flex justify-between mb-8 items-center">
                  <span className="font-display text-xl text-on-surface">Total</span>
                  <span className="font-display text-2xl text-primary font-bold">{soles(total)}</span>
                </div>
                <Link to="/checkout" className="w-full bg-primary text-on-primary rounded-full py-4 font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  Procesar Pago <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoPage;
