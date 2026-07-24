import { useEffect, useState, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Receipt, ArrowLeft, RotateCcw, FileText } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import Boleta from '../components/Boleta';

interface Prod { id: number; nombre: string; imagen: string; precio: number | string; }
interface Detalle { cantidad: number; precio_unitario: number; producto?: Prod; }
interface Pago { metodo: string; estado: string; referencia?: string; }
interface Pedido { id: number; estado: string; tipo: string; total: number; created_at: string; detalles: Detalle[]; pago?: Pago; }

const badge: Record<string, string> = {
  pendiente: 'bg-tertiary-container text-on-tertiary-container',
  en_cocina: 'bg-secondary-container text-on-secondary-container',
  listo: 'bg-primary-container text-on-primary-container',
  entregado: 'bg-primary/10 text-primary',
  cancelado: 'bg-error-container text-on-error-container',
};
const soles = (n: number) => `S/ ${Number(n).toFixed(2)}`;

const MisPedidosPage: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { add } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [boleta, setBoleta] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    api.get<Pedido[]>('/mis-pedidos').then(setPedidos).catch(() => {}).finally(() => setLoading(false));
  }, [user, authLoading]);

  const reordenar = (p: Pedido) => {
    let n = 0;
    p.detalles.forEach(d => {
      if (!d.producto) return;
      for (let i = 0; i < d.cantidad; i++) add({ id: d.producto.id, nombre: d.producto.nombre, precio: d.producto.precio ?? d.precio_unitario, imagen: d.producto.imagen });
      n += d.cantidad;
    });
    success(`${n} productos añadidos al carrito`);
    navigate('/checkout');
  };

  if (!authLoading && !user) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center">
        <p className="text-on-surface-variant mb-6">Inicia sesión para ver tus pedidos.</p>
        <Link to="/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-full">Ingresar</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-8 max-w-4xl mx-auto w-full">
      <h1 className="font-display text-4xl text-primary mb-8">Mis Pedidos</h1>
      {loading ? (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 space-y-4">
              <div className="flex justify-between"><Skeleton className="h-5 w-40" /><Skeleton className="h-6 w-24 rounded-full" /></div>
              <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-16 text-center">
          <Receipt size={48} className="mx-auto mb-4 text-on-surface-variant/40" />
          <p className="font-semibold text-on-surface-variant mb-6">Aún no tienes pedidos.</p>
          <Link to="/menu" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-full">Explorar el menú</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {pedidos.map(p => (
            <div key={p.id} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xl shadow-primary/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <span className="font-display text-xl text-on-surface">Pedido #{p.id}</span>
                  <span className="text-sm text-on-surface-variant ml-3">{new Date(p.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge[p.estado] || 'bg-surface-variant'}`}>{p.estado.replace('_', ' ')}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-variant text-on-surface-variant capitalize">{p.tipo}</span>
                </div>
              </div>
              <ul className="text-sm text-on-surface-variant space-y-1 mb-4 border-y border-outline-variant/40 py-3">
                {p.detalles?.map((d, i) => (
                  <li key={i} className="flex justify-between"><span>{d.cantidad}× {d.producto?.nombre}</span><span>{soles(d.precio_unitario * d.cantidad)}</span></li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-on-surface-variant">Pago: <b className={p.pago?.estado === 'pagado' ? 'text-primary' : 'text-secondary'}>{p.pago?.estado ?? '—'}</b> · {p.pago?.metodo}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setBoleta(p.id)} className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-primary transition"><FileText size={15} /> Ver boleta</button>
                  <button onClick={() => reordenar(p)} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"><RotateCcw size={15} /> Volver a pedir</button>
                  <span className="font-display text-xl font-bold text-primary">{soles(p.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link to="/menu" className="inline-flex items-center gap-2 text-primary font-bold hover:underline mt-8"><ArrowLeft size={16} /> Seguir pidiendo</Link>
      {boleta !== null && <Boleta pedidoId={boleta} onClose={() => setBoleta(null)} />}
    </div>
  );
};

export default MisPedidosPage;
