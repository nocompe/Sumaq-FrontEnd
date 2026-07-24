import { FC, useEffect, useState } from 'react';
import { X, Printer, Leaf } from 'lucide-react';
import { api } from '../lib/api';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;
const METODO_LABEL: Record<string, string> = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', yape: 'Yape / Plin' };
const TIPO_LABEL: Record<string, string> = { takeaway: 'Para llevar', 'dine-in': 'En local', delivery: 'Delivery' };

interface Detalle { cantidad: number; precio_unitario: number | string; notas?: string | null; producto?: { nombre: string }; }
interface Pago { metodo: string; estado: string; referencia?: string; }
interface Usuario { name: string; email?: string; telefono?: string | null; direccion?: string | null; }
interface Pedido {
  id: number; tipo: string; mesa?: string | null; estado: string; total: number | string; created_at: string;
  usuario?: Usuario; pago?: Pago; detalles: Detalle[];
}

const Boleta: FC<{ pedidoId: number; onClose: () => void }> = ({ pedidoId, onClose }) => {
  const [p, setP] = useState<Pedido | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Pedido>(`/pedidos/${pedidoId}/boleta`).then(setP).catch((e: any) => setError(e?.message || 'No se pudo cargar la boleta.'));
  }, [pedidoId]);

  const total = p ? Number(p.total) : 0;
  const opGravada = total / 1.18;
  const igv = total - opGravada;
  const serie = 'B001';
  const numero = String(pedidoId).padStart(8, '0');
  const fecha = p ? new Date(p.created_at) : null;
  const fFecha = fecha ? fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  const fHora = fecha ? fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="boleta-modal fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm no-print" onClick={onClose} />

      <div className="boleta-wrap relative w-full max-w-lg max-h-[92vh] overflow-y-auto qz-pop">
        {/* Boleta imprimible */}
        <div id="boleta-print" className="bg-white rounded-t-2xl border border-outline-variant/40 shadow-2xl p-8 text-on-surface">
          {!p ? (
            <p className="text-center text-on-surface-variant py-16">{error || 'Cargando boleta…'}</p>
          ) : (
            <>
              {/* Encabezado */}
              <div className="text-center border-b border-dashed border-outline pb-5 mb-5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Leaf className="w-5 h-5" /></span>
                  <span className="font-display text-2xl font-bold text-primary">Sumaq</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Gastronomía Andina Saludable S.A.C.<br />
                  RUC 20601234567 · Av. La Paz 1045, Miraflores, Lima<br />
                  (01) 445-8820
                </p>
                <div className="mt-4 inline-block border border-outline rounded-xl px-6 py-2">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Boleta de Venta Electrónica</p>
                  <p className="font-display text-lg font-bold text-on-surface">{serie} - {numero}</p>
                </div>
              </div>

              {/* Datos */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-5">
                <p className="text-on-surface-variant">Fecha de emisión</p>
                <p className="text-right font-semibold">{fFecha} · {fHora}</p>
                <p className="text-on-surface-variant">Cliente</p>
                <p className="text-right font-semibold truncate">{p.usuario?.name ?? 'Consumidor final'}</p>
                {p.usuario?.email && (<><p className="text-on-surface-variant">Correo</p><p className="text-right font-semibold truncate">{p.usuario.email}</p></>)}
                <p className="text-on-surface-variant">Tipo</p>
                <p className="text-right font-semibold">{TIPO_LABEL[p.tipo] ?? p.tipo}{p.mesa ? ` · Mesa ${p.mesa}` : ''}</p>
              </div>

              {/* Detalle */}
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-y border-outline text-on-surface-variant">
                    <th className="text-left py-2 font-bold">Cant.</th>
                    <th className="text-left py-2 font-bold">Descripción</th>
                    <th className="text-right py-2 font-bold">P.U.</th>
                    <th className="text-right py-2 font-bold">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {p.detalles?.map((d, i) => (
                    <tr key={i} className="border-b border-outline-variant/40 align-top">
                      <td className="py-2">{d.cantidad}</td>
                      <td className="py-2">
                        {d.producto?.nombre}
                        {d.notas && <span className="block text-[10px] italic text-on-surface-variant">Nota: {d.notas}</span>}
                      </td>
                      <td className="py-2 text-right">{soles(d.precio_unitario)}</td>
                      <td className="py-2 text-right font-semibold">{soles(Number(d.precio_unitario) * d.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totales */}
              <div className="ml-auto w-56 text-xs space-y-1 mb-5">
                <div className="flex justify-between text-on-surface-variant"><span>Op. Gravada</span><span>{soles(opGravada)}</span></div>
                <div className="flex justify-between text-on-surface-variant"><span>IGV (18%)</span><span>{soles(igv)}</span></div>
                <div className="flex justify-between font-display text-lg font-bold text-primary border-t border-outline pt-1"><span>TOTAL</span><span>{soles(total)}</span></div>
              </div>

              {/* Pago */}
              <div className="bg-surface-container-low/60 rounded-xl p-3 text-xs flex justify-between items-center mb-5">
                <span className="font-semibold text-on-surface-variant">Forma de pago: <b className="text-on-surface">{METODO_LABEL[p.pago?.metodo ?? ''] ?? p.pago?.metodo ?? '—'}</b></span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${p.pago?.estado === 'pagado' ? 'bg-primary/10 text-primary' : 'bg-tertiary-container text-on-tertiary-container'}`}>{p.pago?.estado === 'pagado' ? 'PAGADO' : 'PENDIENTE'}</span>
              </div>
              {p.pago?.referencia && <p className="text-center text-[10px] text-on-surface-variant mb-4">Ref: {p.pago.referencia}</p>}

              {/* Pie */}
              <div className="text-center border-t border-dashed border-outline pt-4">
                <p className="text-xs font-semibold text-on-surface">¡Gracias por tu compra!</p>
                <p className="text-[10px] text-on-surface-variant">Representación impresa de la boleta de venta electrónica.</p>
              </div>
            </>
          )}
        </div>

        {/* Barra de acciones (no se imprime) */}
        <div className="no-print bg-surface-container-lowest rounded-b-2xl border border-t-0 border-outline-variant/40 shadow-2xl p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-variant transition inline-flex items-center gap-2"><X className="w-4 h-4" /> Cerrar</button>
          <button onClick={() => window.print()} disabled={!p} className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold shadow-md hover:brightness-110 transition inline-flex items-center gap-2 disabled:opacity-50"><Printer className="w-4 h-4" /> Imprimir</button>
        </div>
      </div>
    </div>
  );
};

export default Boleta;
