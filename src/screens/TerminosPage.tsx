import { FC } from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { rise } from '../lib/reveal';

const secciones: [string, string[]][] = [
  ['1. Aceptación de los términos', [
    'Al usar la plataforma Sumaq y realizar pedidos a través de ella, aceptas estos Términos y Condiciones en su totalidad.',
    'Si no estás de acuerdo con alguno de los puntos, te pedimos no utilizar el servicio.',
  ]],
  ['2. Uso de la cuenta', [
    'Para realizar pedidos debes crear una cuenta con datos veraces y mantener la confidencialidad de tu contraseña.',
    'Eres responsable de la actividad realizada desde tu cuenta. Notifícanos de inmediato ante cualquier uso no autorizado.',
  ]],
  ['3. Pedidos y precios', [
    'Los precios están expresados en soles (S/) e incluyen IGV.',
    'El precio aplicable es el mostrado en la plataforma al momento de confirmar el pedido.',
    'Nos reservamos el derecho de rechazar un pedido por falta de stock, error evidente de precio o incumplimiento de estos términos.',
  ]],
  ['4. Pagos y comprobantes', [
    'Aceptamos efectivo, tarjeta y billeteras digitales (Yape / Plin).',
    'Por cada pedido se emite una boleta de venta electrónica, disponible para descarga e impresión desde "Mis Pedidos".',
  ]],
  ['5. Entrega y recojo', [
    'El tiempo estimado de preparación es de 15 a 20 minutos y puede variar según la demanda.',
    'En delivery, el tiempo depende de la zona y las condiciones de tránsito. Te mostramos el estado del pedido en tiempo real.',
    'Para pedidos en local, el código de recojo mostrado en la confirmación es tu comprobante.',
  ]],
  ['6. Cancelaciones y devoluciones', [
    'Puedes cancelar un pedido sin costo mientras siga en estado "Pendiente".',
    'Si el pedido ya entró a cocina, no es posible cancelarlo por tratarse de alimentos preparados.',
    'Si recibes un producto en mal estado o distinto al solicitado, contáctanos dentro de las 2 horas siguientes para reponerlo o reembolsarlo.',
  ]],
  ['7. Alergias e información nutricional', [
    'La información nutricional es referencial y puede variar según la preparación.',
    'Si tienes alguna alergia, indícalo en la nota del plato al hacer el pedido. Nuestros alimentos se preparan en cocinas donde se manipulan frutos secos, gluten y lácteos.',
  ]],
  ['8. Modificaciones', [
    'Podemos actualizar estos términos en cualquier momento. La versión vigente será siempre la publicada en esta página.',
  ]],
];

const TerminosPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-12 px-8 max-w-4xl mx-auto w-full text-center">
      <motion.div {...rise(0)} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6"><FileText className="w-8 h-8" /></motion.div>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl text-on-surface mb-4 leading-tight">Términos y Condiciones</motion.h1>
      <motion.p {...rise(0.16)} className="text-on-surface-variant">Última actualización: 23 de julio de 2026</motion.p>
    </section>

    <section className="pb-24 px-8 max-w-4xl mx-auto w-full">
      <div className="space-y-5">
        {secciones.map(([titulo, parrafos], i) => (
          <motion.div key={i} {...rise(Math.min(i, 4) * 0.06)} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
            <h2 className="font-display text-xl text-on-surface mb-4">{titulo}</h2>
            <div className="space-y-3">
              {parrafos.map((p, j) => <p key={j} className="text-on-surface-variant text-sm leading-relaxed">{p}</p>)}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-on-surface-variant mt-10">
        ¿Dudas sobre estos términos? Escríbenos desde la página de <a href="/contacto" className="text-primary font-semibold hover:underline">Contacto</a>.
      </p>
    </section>
  </div>
);

export default TerminosPage;
