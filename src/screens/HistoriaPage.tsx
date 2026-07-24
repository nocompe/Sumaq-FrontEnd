import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sprout, HeartHandshake, Leaf, ArrowRight, LucideIcon } from 'lucide-react';
import { rise } from '../lib/reveal';

const hitos: [string, string, string][] = [
  ['2015', 'El origen', 'Todo comenzó en una pequeña cocina en el Valle Sagrado, donde nuestra fundadora rescató recetas ancestrales de su abuela quechua.'],
  ['2018', 'Primer local', 'Abrimos nuestra primera casa en Cusco, uniendo el tarwi, la quinua y la kiwicha con técnicas de alta cocina.'],
  ['2021', 'Expansión a Lima', 'Llevamos la filosofía Sumaq a la capital, con tres locales que celebran los superalimentos andinos.'],
  ['2024', 'Cocina consciente', 'Adoptamos un modelo 100% sostenible: productores locales, cero desperdicio y empaques compostables.'],
];
const valores: [LucideIcon, string, string][] = [
  [Sprout, 'Raíces Andinas', 'Honramos la tierra y las tradiciones de nuestros pueblos originarios en cada plato.'],
  [HeartHandshake, 'Comercio Justo', 'Trabajamos directamente con más de 40 familias productoras de los Andes.'],
  [Leaf, 'Sostenibilidad', 'Ingredientes de temporada, orgánicos y de kilómetro cero.'],
];

const HistoriaPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-16 px-8 max-w-5xl mx-auto w-full text-center">
      <motion.span {...rise(0)} className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Nuestra Historia</motion.span>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl md:text-6xl text-on-surface mb-6 leading-tight">Del Valle Sagrado<br />a tu mesa</motion.h1>
      <motion.p {...rise(0.16)} className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
        Sumaq nace del deseo de rescatar la sabiduría culinaria de los Andes y presentarla con el cuidado que merece la alta cocina moderna. "Sumaq" significa <em>bello, bueno, delicioso</em> en quechua — un homenaje a la tierra y a las guardianas de nuestras recetas.
      </motion.p>
    </section>

    <section className="pb-20 px-8 max-w-4xl mx-auto w-full">
      <div className="relative border-l-2 border-outline-variant/40 ml-4 pl-10 space-y-12">
        {hitos.map(([anio, titulo, texto], i) => (
          <motion.div key={i} {...rise(i * 0.08, 'left')} className="relative">
            <span className="absolute -left-[54px] top-0 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-display font-bold text-xs shadow-lg">{anio}</span>
            <h3 className="font-display text-2xl text-on-surface mb-2">{titulo}</h3>
            <p className="text-on-surface-variant leading-relaxed">{texto}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-7xl mx-auto w-full">
      <motion.h2 {...rise(0)} className="font-display text-4xl text-primary text-center mb-14">Lo que nos mueve</motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {valores.map(([Icon, t, d], i) => (
          <motion.div key={i} {...rise(i * 0.1)} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-hover">
            <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6"><Icon className="w-7 h-7" /></div>
            <h3 className="font-display text-xl text-on-surface mb-2">{t}</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-4xl mx-auto w-full">
      <motion.div {...rise(0, 'zoom')} className="bg-primary text-on-primary rounded-[2.5rem] p-12 text-center shadow-xl">
        <h2 className="font-display text-3xl mb-3">¿Listo para probar nuestra historia?</h2>
        <p className="text-on-primary/80 mb-8 max-w-xl mx-auto">Cada plato es un capítulo. Descúbrelos en nuestro menú.</p>
        <Link to="/menu" className="qz-cta inline-flex items-center gap-2 bg-surface text-primary font-semibold px-8 py-4 rounded-full">
          Ver el menú <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  </div>
);

export default HistoriaPage;
