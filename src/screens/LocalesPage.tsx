import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Map, ArrowRight } from 'lucide-react';
import { rise } from '../lib/reveal';

const locales: [string, string, string, string, boolean][] = [
  ['Sumaq Miraflores', 'Av. La Paz 1045, Miraflores, Lima', '(01) 445-8820', 'Lun a Dom · 8:00 – 22:00', true],
  ['Sumaq San Isidro', 'Calle Los Libertadores 320, San Isidro, Lima', '(01) 421-7799', 'Lun a Sáb · 9:00 – 21:00', false],
  ['Sumaq Barranco', 'Jr. Unión 210, Barranco, Lima', '(01) 247-3311', 'Mar a Dom · 10:00 – 23:00', false],
  ['Sumaq Cusco', 'Calle Plateros 148, Centro Histórico, Cusco', '(084) 246-100', 'Lun a Dom · 7:30 – 22:30', true],
];

const LocalesPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-14 px-8 max-w-5xl mx-auto w-full text-center">
      <motion.span {...rise(0)} className="inline-block bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Nuestros Locales</motion.span>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl md:text-6xl text-on-surface mb-6 leading-tight">Te esperamos<br />cerca de ti</motion.h1>
      <motion.p {...rise(0.16)} className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
        Cuatro casas Sumaq donde la cocina andina saludable cobra vida. Ven a visitarnos o pide delivery desde nuestro menú.
      </motion.p>
    </section>

    <section className="pb-24 px-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locales.map(([nombre, dir, tel, horario, flagship], i) => (
          <motion.div key={i} {...rise((i % 2) * 0.12)} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 flex flex-col qz-hover">
            <div className="flex items-start justify-between mb-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center"><MapPin className="w-6 h-6" /></div>
              {flagship && <span className="bg-tertiary/15 text-tertiary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Local Principal</span>}
            </div>
            <h3 className="font-display text-2xl text-on-surface mb-4">{nombre}</h3>
            <ul className="space-y-3 text-sm text-on-surface-variant mb-6">
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary shrink-0" /> {dir}</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary shrink-0" /> {tel}</li>
              <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary shrink-0" /> {horario}</li>
            </ul>
            <div className="mt-auto h-32 rounded-2xl bg-surface-variant/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/50 gap-2">
              <Map className="w-5 h-5" /> <span className="text-xs font-semibold">Mapa referencial</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="pb-24 px-8 max-w-4xl mx-auto w-full">
      <motion.div {...rise(0, 'zoom')} className="bg-primary text-on-primary rounded-[2.5rem] p-12 text-center shadow-xl">
        <h2 className="font-display text-3xl mb-3">¿Prefieres quedarte en casa?</h2>
        <p className="text-on-primary/80 mb-8 max-w-xl mx-auto">Pide delivery desde cualquiera de nuestros locales y recibe Sumaq en tu puerta.</p>
        <Link to="/menu" className="qz-cta inline-flex items-center gap-2 bg-surface text-primary font-semibold px-8 py-4 rounded-full">
          Pedir ahora <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  </div>
);

export default LocalesPage;
