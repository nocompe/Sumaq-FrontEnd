import { FC } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Database, Lock, UserCheck, LucideIcon } from 'lucide-react';
import { rise } from '../lib/reveal';

const resumen: [LucideIcon, string, string][] = [
  [Database, 'Qué guardamos', 'Nombre, correo, teléfono, dirección de entrega e historial de pedidos.'],
  [Lock, 'Cómo lo protegemos', 'Contraseñas cifradas con bcrypt y acceso por roles al panel interno.'],
  [UserCheck, 'Tus derechos', 'Puedes acceder, corregir o eliminar tus datos cuando quieras.'],
];

const secciones: [string, string[]][] = [
  ['1. Datos que recopilamos', [
    'Datos de cuenta: nombre, correo electrónico, teléfono y dirección de entrega.',
    'Datos de pedidos: platos solicitados, notas, método de pago y comprobantes emitidos.',
    'No almacenamos números completos de tarjeta: el pago se procesa por el operador correspondiente.',
  ]],
  ['2. Para qué los usamos', [
    'Procesar y entregar tus pedidos, y emitir la boleta de venta electrónica.',
    'Mostrarte tu historial y permitirte repetir pedidos.',
    'Mejorar el menú y el servicio a partir de datos agregados y anónimos.',
  ]],
  ['3. Con quién los compartimos', [
    'No vendemos ni cedemos tus datos personales a terceros con fines publicitarios.',
    'Solo compartimos lo mínimo necesario con el repartidor asignado (nombre, dirección y teléfono) para completar la entrega.',
  ]],
  ['4. Seguridad', [
    'Las contraseñas se almacenan con hash bcrypt: nadie —ni el equipo de Sumaq— puede leerlas.',
    'El acceso al panel administrativo está restringido por rol (administrador, cajero, cocina, mesero).',
    'Las sesiones usan tokens de acceso que puedes cerrar en cualquier momento.',
  ]],
  ['5. Conservación', [
    'Conservamos tu historial de pedidos mientras tu cuenta esté activa, por temas contables y de garantía.',
    'Si solicitas la eliminación de tu cuenta, borramos tus datos personales y mantenemos solo los registros contables anonimizados exigidos por ley.',
  ]],
  ['6. Tus derechos', [
    'Puedes actualizar tus datos desde "Mi Perfil" en cualquier momento.',
    'Puedes solicitar una copia o la eliminación de tus datos escribiéndonos desde la página de Contacto.',
  ]],
];

const PrivacidadPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-12 px-8 max-w-4xl mx-auto w-full text-center">
      <motion.div {...rise(0)} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6"><ShieldCheck className="w-8 h-8" /></motion.div>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl text-on-surface mb-4 leading-tight">Política de Privacidad</motion.h1>
      <motion.p {...rise(0.16)} className="text-on-surface-variant">Tus datos son tuyos. Esto es todo lo que hacemos con ellos.</motion.p>
    </section>

    <section className="pb-16 px-8 max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resumen.map(([Icon, t, d], i) => (
          <motion.div key={i} {...rise(i * 0.1)} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-hover">
            <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6"><Icon className="w-7 h-7" /></div>
            <h3 className="font-display text-lg text-on-surface mb-2">{t}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-4xl mx-auto w-full">
      <div className="space-y-5">
        {secciones.map(([titulo, parrafos], i) => (
          <motion.div key={i} {...rise(Math.min(i, 4) * 0.06)} className="bg-surface-container-low rounded-3xl border border-outline-variant/30 p-8">
            <h2 className="font-display text-xl text-on-surface mb-4">{titulo}</h2>
            <ul className="space-y-3">
              {parrafos.map((p, j) => (
                <li key={j} className="flex gap-3 text-on-surface-variant text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

export default PrivacidadPage;
