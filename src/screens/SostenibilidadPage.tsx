import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Recycle, Truck, Sprout, HeartHandshake, ArrowRight, LucideIcon } from 'lucide-react';
import { rise } from '../lib/reveal';

const pilares: [LucideIcon, string, string][] = [
  [Sprout, 'Kilómetro cero', 'Compramos directamente a más de 40 familias productoras de los Andes, reduciendo intermediarios y huella de transporte.'],
  [Recycle, 'Empaques compostables', 'Todos nuestros envases de delivery son de fibra vegetal y se degradan en menos de 90 días.'],
  [Leaf, 'Cero desperdicio', 'Aprovechamos tallos, cáscaras y recortes en caldos y salsas. Lo que no se usa va a compostaje.'],
  [Truck, 'Logística eficiente', 'Rutas agrupadas por zona para reducir viajes y mantener la cadena de frío con menos energía.'],
];

const metas: [string, string][] = [
  ['90%', 'de nuestros insumos son de origen nacional'],
  ['100%', 'de empaques compostables o reutilizables'],
  ['40+', 'familias productoras con comercio justo'],
  ['0', 'residuos orgánicos enviados a relleno sanitario'],
];

const SostenibilidadPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-16 px-8 max-w-5xl mx-auto w-full text-center">
      <motion.span {...rise(0)} className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Sostenibilidad</motion.span>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl md:text-6xl text-on-surface mb-6 leading-tight">Cocinar cuidando<br />la tierra</motion.h1>
      <motion.p {...rise(0.16)} className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
        En Sumaq entendemos que no hay comida saludable en un planeta enfermo. Por eso cada decisión —desde el proveedor hasta el empaque— busca devolverle a la tierra lo que nos da.
      </motion.p>
    </section>

    <section className="pb-20 px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pilares.map(([Icon, t, d], i) => (
          <motion.div key={i} {...rise((i % 4) * 0.1)} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-hover">
            <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6"><Icon className="w-7 h-7" /></div>
            <h3 className="font-display text-lg text-on-surface mb-2">{t}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-6xl mx-auto w-full">
      <motion.h2 {...rise(0)} className="font-display text-4xl text-primary text-center mb-12">Nuestros compromisos</motion.h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {metas.map(([num, txt], i) => (
          <motion.div key={i} {...rise(i * 0.08)} className="bg-surface-container-low rounded-3xl border border-outline-variant/30 p-8 qz-hover">
            <p className="font-display text-4xl md:text-5xl text-primary font-bold mb-2">{num}</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">{txt}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-4xl mx-auto w-full">
      <motion.div {...rise(0, 'zoom')} className="bg-primary text-on-primary rounded-[2.5rem] p-12 text-center shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12"><HeartHandshake className="w-40 h-40" /></div>
        <div className="relative z-10">
          <h2 className="font-display text-3xl mb-3">Come rico, cuida el planeta</h2>
          <p className="text-on-primary/80 mb-8 max-w-xl mx-auto">Cada pedido en Sumaq apoya a productores locales y evita residuos.</p>
          <Link to="/menu" className="qz-cta inline-flex items-center gap-2 bg-surface text-primary font-semibold px-8 py-4 rounded-full">
            Ver el menú <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  </div>
);

export default SostenibilidadPage;
