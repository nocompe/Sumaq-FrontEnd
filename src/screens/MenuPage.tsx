import { useEffect, useState, FC } from 'react';
import { ShoppingCart, Plus, Minus, ArrowRight, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';
import { CardGridSkeleton } from '../components/Skeleton';

interface Producto {
  id: number; nombre: string; descripcion: string; precio: number | string;
  imagen: string; tag?: string | null; calorias?: number; proteina?: string; categoria_id: number;
}
interface Cat { id: number; nombre: string; n: number; }

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;

const MenuPage: FC = () => {
  const { items, add, inc, dec, remove, count, total } = useCart();
  const { success } = useToast();
  const [cats, setCats] = useState<Cat[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [catSel, setCatSel] = useState<number>(0);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get<Cat[]>('/categorias').then(setCats).catch(() => {}); }, []);
  useEffect(() => { const t = setTimeout(() => setDebouncedQ(q), 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (catSel) p.set('cat', String(catSel));
    if (debouncedQ) p.set('q', debouncedQ);
    api.get<Producto[]>(`/productos?${p}`).then(setProductos).catch(() => {}).finally(() => setLoading(false));
  }, [catSel, debouncedQ]);

  const catNombre = catSel === 0 ? 'Nuestro' : (cats.find(c => c.id === catSel)?.nombre ?? '');
  const onAdd = (p: Producto) => { add(p); success(`${p.nombre} agregado al carrito`); };

  return (
    <div className="pt-24 pb-12 px-8 max-w-[1440px] mx-auto w-full grid grid-cols-12 gap-8 min-h-screen">
      {/* Categorías */}
      <aside className="col-span-12 md:col-span-2">
        <div className="sticky top-28">
          <h2 className="font-display text-2xl text-on-surface mb-8">Categorías</h2>
          <nav className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
            <button onClick={() => setCatSel(0)} className={cn("text-left w-full px-5 py-3 rounded-xl font-bold text-sm transition-all", catSel === 0 ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary")}>Todos</button>
            {cats.map(c => (
              <button key={c.id} onClick={() => setCatSel(c.id)} className={cn("text-left w-full px-5 py-3 rounded-xl font-bold text-sm transition-all", catSel === c.id ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary")}>{c.nombre}</button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Grid */}
      <section className="col-span-12 md:col-span-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-primary">{catNombre} Saludables</h1>
          <div className="relative sm:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar platillo…" className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
        </div>
        {loading ? <CardGridSkeleton /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map(p => (
              <article key={p.id} className="bg-surface-container-low rounded-3xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="h-48 bg-surface-variant relative group">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.tag && <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full border border-outline-variant/50 text-[10px] font-bold text-primary uppercase tracking-widest">{p.tag}</div>}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display text-lg text-on-surface mb-2 leading-tight">{p.nombre}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">{p.descripcion}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-display text-xl text-primary font-bold">{soles(p.precio)}</span>
                    <button onClick={() => onAdd(p)} className="bg-secondary-container text-on-secondary-container rounded-full w-10 h-10 flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all shadow-sm active:scale-90"><Plus size={20} /></button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && productos.length === 0 && <p className="text-on-surface-variant col-span-full py-10 text-center">No se encontraron platillos.</p>}
          </div>
        )}
      </section>

      {/* Carrito persistente */}
      <aside className="col-span-12 md:col-span-3">
        <div className="sticky top-28 bg-surface-container-low rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          <div className="p-6 border-b border-outline-variant/20 bg-surface-container-highest/30 flex justify-between items-center">
            <h2 className="font-display text-xl text-on-surface">Tu Pedido</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{count} items</span>
          </div>
          <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6">
            {items.map(it => (
              <div key={it.id} className="flex gap-4 items-start">
                <img src={it.imagen} alt={it.nombre} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-outline-variant/20" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-on-surface text-sm">{it.nombre}</h4>
                  <span className="text-xs text-on-surface-variant block mb-2">{soles(it.precio)}</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => dec(it.id)} className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-variant"><Minus size={12} /></button>
                      <span className="font-bold text-sm w-4 text-center">{it.cantidad}</span>
                      <button onClick={() => inc(it.id)} className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-variant"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => remove(it.id)} className="text-outline hover:text-error"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant/40 gap-4">
                <ShoppingCart size={48} strokeWidth={1} />
                <p className="font-semibold text-sm">Tu carrito está vacío</p>
              </div>
            )}
          </div>
          <div className="p-6 bg-surface-container-highest border-t border-outline-variant/20 mt-auto">
            <div className="flex justify-between mb-6">
              <span className="font-display text-xl text-on-surface">Total</span>
              <span className="font-display text-xl text-primary font-bold">{soles(total)}</span>
            </div>
            <Link to="/checkout" className={cn("w-full bg-primary text-on-primary rounded-full py-4 font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2", items.length === 0 && "opacity-50 pointer-events-none grayscale")}>
              Procesar Pago <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MenuPage;
