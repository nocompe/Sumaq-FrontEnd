import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HeartPulse, Flame, Shield, Sprout, Leaf, ArrowRight, LucideIcon } from 'lucide-react';
import { rise } from '../lib/reveal';

const pilares: [LucideIcon, string, string][] = [
  [HeartPulse, 'Nutrición Balanceada', 'Cada menú es diseñado por nutricionistas para equilibrar proteínas, carbohidratos complejos y grasas saludables.'],
  [Flame, 'Energía Real', 'Superalimentos como la maca, la quinua y la kiwicha aportan energía sostenida sin picos de azúcar.'],
  [Shield, 'Sistema Inmune', 'Antioxidantes del aguaymanto, la muña y el camu camu refuerzan tus defensas naturalmente.'],
  [Sprout, 'Digestión Ligera', 'Preparaciones bajas en grasas y ricas en fibra que cuidan tu bienestar diario.'],
];
const superfoods: [string, string][] = [
  ['Quinua', 'Proteína completa con los 9 aminoácidos esenciales.'],
  ['Tarwi', 'Legumbre andina con más proteína que la soya.'],
  ['Kiwicha', 'Rica en calcio, hierro y magnesio.'],
  ['Maca', 'Adaptógeno que mejora energía y concentración.'],
  ['Aguaymanto', 'Explosión de vitamina C y antioxidantes.'],
  ['Camu Camu', 'La fuente natural más alta de vitamina C.'],
];

const SaludPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-16 px-8 max-w-5xl mx-auto w-full text-center">
      <motion.span {...rise(0)} className="inline-block bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Salud & Bienestar</motion.span>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl md:text-6xl text-on-surface mb-6 leading-tight">Comer bien es<br />cuidarte de raíz</motion.h1>
      <motion.p {...rise(0.16)} className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
        En Sumaq creemos que la mejor medicina está en la tierra. Combinamos la sabiduría nutricional de los Andes con la ciencia moderna para que cada bocado te haga sentir mejor.
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
      <div className="text-center mb-14">
        <motion.h2 {...rise(0)} className="font-display text-4xl text-primary mb-3">Nuestros Superalimentos</motion.h2>
        <motion.p {...rise(0.1)} className="text-on-surface-variant max-w-2xl mx-auto">Ingredientes ancestrales con un perfil nutricional extraordinario.</motion.p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {superfoods.map(([nombre, desc], i) => (
          <motion.div key={i} {...rise((i % 3) * 0.08)} className="flex items-start gap-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 qz-hover">
            <div className="shrink-0 w-11 h-11 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center font-display font-bold">{i + 1}</div>
            <div>
              <h3 className="font-semibold text-on-surface mb-1">{nombre}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-4xl mx-auto w-full">
      <motion.div {...rise(0, 'zoom')} className="bg-secondary/5 border border-secondary/20 rounded-[2.5rem] p-12 text-center">
        <div className="text-secondary flex justify-center mb-4"><Leaf className="w-10 h-10" /></div>
        <h2 className="font-display text-3xl text-on-surface mb-3">Menús pensados para tu bienestar</h2>
        <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">Cada plato indica sus calorías y macronutrientes. Come informado, come Sumaq.</p>
        <Link to="/menu" className="qz-cta inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-8 py-4 rounded-full">
          Explorar el menú <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  </div>
);

export default SaludPage;
