import { FC, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, CookingPot, ShoppingBag, ArrowLeft, Receipt, FileText } from 'lucide-react';
import Boleta from '../components/Boleta';
import { api } from '../lib/api';

const soles = (n: number) => `S/ ${Number(n).toFixed(2)}`;
const ESTADO_TXT: Record<string, string> = { pendiente: 'Pagado · en espera', en_cocina: 'En preparación', listo: 'Listo para recoger', entregado: 'Entregado', cancelado: 'Cancelado' };

const ConfirmationPage: FC = () => {
  const location = useLocation();
  const pedido: any = (location.state as any)?.pedido;
  const [verBoleta, setVerBoleta] = useState(false);
  const [estado, setEstado] = useState<string>(pedido?.estado || 'pendiente');

  // Seguimiento en vivo: consulta el estado real del pedido cada 5s hasta entregado/cancelado.
  useEffect(() => {
    if (!pedido?.id) return;
    let alive = true;
    const poll = () => api.get<any>(`/pedidos/${pedido.id}/boleta`).then(p => { if (alive && p?.estado) setEstado(p.estado); }).catch(() => {});
    poll();
    const t = setInterval(() => {
      if (estado === 'entregado' || estado === 'cancelado') return;
      poll();
    }, 5000);
    return () => { alive = false; clearInterval(t); };
  }, [pedido?.id, estado]);

  if (!pedido) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center">
        <p className="text-on-surface-variant mb-6">No hay un pedido reciente que mostrar.</p>
        <Link to="/menu" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-full">Ir al menú</Link>
      </div>
    );
  }

  const codigo = 'Q-' + String(pedido.id).padStart(3, '0');
  const orden: Record<string, number> = { pendiente: 1, en_cocina: 2, listo: 3, entregado: 4 };
  const nivel = orden[estado] || 1;
  const finalizado = estado === 'entregado' || estado === 'cancelado';

  return (
    <div className="pt-28 pb-24 px-8 max-w-6xl mx-auto w-full min-h-[90vh] flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/50 p-10 md:p-16 shadow-2xl shadow-primary/5 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 ring-8 ring-primary/5">
            <CheckCircle2 className="text-primary" size={56} />
          </div>
          <h1 className="font-display text-5xl text-on-surface mb-6 leading-tight">¡Pedido Confirmado!</h1>
          <p className="text-lg text-on-surface-variant mb-12 max-w-lg leading-relaxed">Tu pedido en Sumaq está siendo preparado con los ingredientes más frescos.</p>
          <div className="bg-surface rounded-3xl border border-outline-variant/40 p-10 w-full max-w-md shadow-lg mb-12">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Código de Recojo</p>
            <p className="font-display text-7xl text-primary font-bold tracking-tight">{codigo}</p>
          </div>
          <div className="flex items-center gap-4 bg-tertiary/5 px-8 py-5 rounded-full border border-tertiary/20">
            <Clock className="text-tertiary" size={24} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Tiempo estimado</p>
              <p className="font-bold text-on-surface leading-tight">15 - 20 minutos</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl text-on-surface">Estado del Pedido</h2>
              {!finalizado && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-widest">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
                  En vivo
                </span>
              )}
            </div>
            {estado === 'cancelado' ? (
              <div className="bg-error-container text-on-error-container rounded-2xl px-4 py-3 text-sm font-semibold">Este pedido fue cancelado.</div>
            ) : (
              <div className="space-y-8">
                {[[1, 'Pagado', CheckCircle2], [2, 'En cocina', CookingPot], [3, 'Listo para recoger', ShoppingBag]].map(([lvl, txt, Icon]: any) => (
                  <div key={lvl} className="flex gap-4 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${nivel >= lvl ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-outline'}`}><Icon size={16} /></div>
                    <p className={`font-bold text-sm ${nivel >= lvl ? 'text-on-surface' : 'text-on-surface-variant opacity-60'}`}>{txt}</p>
                    {nivel === lvl && !finalizado && <span className="ml-auto text-[10px] font-bold text-primary uppercase">Actual</span>}
                  </div>
                ))}
                {estado === 'entregado' && <p className="text-sm font-semibold text-primary flex items-center gap-2"><CheckCircle2 size={16} /> ¡Pedido entregado!</p>}
              </div>
            )}
          </div>
          <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-6">Resumen</h3>
            <div className="space-y-3 mb-6">
              {pedido.detalles?.map((d: any, i: number) => (
                <div key={i} className="flex justify-between text-sm font-semibold text-on-surface"><span>{d.producto?.nombre}</span><span>x{d.cantidad}</span></div>
              ))}
            </div>
            <div className="pt-6 border-t border-outline-variant/20 flex justify-between items-center">
              <span className="text-sm font-bold text-on-surface-variant">Total</span>
              <span className="font-display text-2xl font-bold text-primary">{soles(pedido.total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center flex flex-wrap justify-center gap-6">
        <Link to="/menu" className="text-primary font-bold hover:underline inline-flex items-center gap-2"><ArrowLeft size={16} /> Seguir pidiendo</Link>
        <button onClick={() => setVerBoleta(true)} className="text-on-surface-variant font-bold hover:text-primary inline-flex items-center gap-2"><FileText size={16} /> Ver boleta</button>
        <Link to="/mis-pedidos" className="text-on-surface-variant font-bold hover:text-primary inline-flex items-center gap-2"><Receipt size={16} /> Ver mis pedidos</Link>
      </div>
      {verBoleta && <Boleta pedidoId={pedido.id} onClose={() => setVerBoleta(false)} />}
    </div>
  );
};

export default ConfirmationPage;
