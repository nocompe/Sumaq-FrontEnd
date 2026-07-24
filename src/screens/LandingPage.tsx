import { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles, ArrowRight, ChevronDown, Leaf, BookOpen, Store, Receipt, Users,
  Flame, Plus, UtensilsCrossed, ShoppingCart, Bike, HeartPulse, Truck, Sprout, Star,
} from 'lucide-react';
import { api } from '../lib/api';

const soles = (n: number | string) => `S/ ${Number(n).toFixed(2)}`;
const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq7vKsHOBLwJax7kwvbENJiuys8D31cIyvWNZrBqgo7RrgdF4339iZlbl3STjHpJ0LPlE8a6g_ccOZlsA0RHvvpAwmuD_1jRa48aEYzUYZMTEQ-iH-a2-K_YrxDkLhx_zws7CLH4-gvAIiMNt05cbb8Ej982kUc2fmwtIFuSEkHS-EOvz2bgudenmf0_D_ZwFYgdHvJHU_nmzU8Q5bRm8brFUYo9HI2ja6IxpuqNxMlsWmHEFle5Ex5sfErJ52S0ah7SjVbHcjHHo';
const BENTO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt7ynPFVH908UrSHxW8j7dpy9VZJqpoYpldLGR4xzYXbv7Rq5oi_82qsKrzIMDvPzjM49j8Bu8BrBaoEkoE-7sSC5c_BCrUhrt60_QfPgfczFDNdcKB8Gw9VeBnU_I6XRCuz5hO5x_DuvIUTZJ6VDRyN-bHkAlPQE7e_o59Eaa_gItXzANqaZkHNsKAxPGfURqrwxGN03cguHnZRmVTeeUYNx4RQcGcWl5XgoTV46sH1BxX35tKfaqJYG-RQKw78VJ5oMVUVAjHqY';

const FOODS = ['Quinua', 'Tarwi', 'Kiwicha', 'Maca', 'Aguaymanto', 'Camu Camu', 'Muña', 'Cañihua', 'Cacao', 'Sacha Inchi'];
const PASOS: [typeof UtensilsCrossed, string, string][] = [
  [UtensilsCrossed, 'Explora el menú', 'Descubre platos andinos con su información nutricional completa.'],
  [ShoppingCart, 'Haz tu pedido', 'Arma tu carrito y elige cómo pagar en segundos.'],
  [Bike, 'Recíbelo', 'Delivery a tu puerta o recójelo en el local más cercano.'],
];
const REVIEWS: [string, string, string][] = [
  ['Valeria Quispe', 'Miraflores', 'Los sabores andinos con presentación de restaurante fino. El ceviche de hongos es una locura.'],
  ['Diego Mamani', 'Cusco', 'Pido casi todos los días. Comida saludable, rica y que llega rapidísimo. 100% recomendado.'],
  ['Camila Rojas', 'San Isidro', 'Por fin un lugar donde comer sano no es aburrido. La quinua nunca supo tan bien.'],
];

// reveal reutilizable (equivale a data-reveal del Blade)
const rise = (delay = 0, from: 'up' | 'zoom' | 'left' | 'right' = 'up') => {
  const hidden = from === 'zoom' ? { opacity: 0, scale: 0.92 } : from === 'left' ? { opacity: 0, x: -40 } : from === 'right' ? { opacity: 0, x: 40 } : { opacity: 0, y: 28 };
  const show = { opacity: 1, x: 0, y: 0, scale: 1 };
  return { initial: hidden, whileInView: show, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } };
};

const CountUp: FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let done = false;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !done) {
          done = true;
          const dur = 1400; let start: number | null = null;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
};

interface Destacado { id: number; nombre: string; descripcion: string; precio: number | string; imagen: string; tag?: string | null; categoria?: { nombre: string }; }
interface Stats { productos: number; pedidos: number; clientes: number; }

const LandingPage: FC = () => {
  const [destacados, setDestacados] = useState<Destacado[]>([]);
  const [stats, setStats] = useState<Stats>({ productos: 0, pedidos: 0, clientes: 0 });

  useEffect(() => {
    api.get<{ destacados: Destacado[]; stats: Stats }>('/home').then(d => { setDestacados(d.destacados); setStats(d.stats); }).catch(() => {});
  }, []);

  const tarjetas: [typeof BookOpen, number, string, string][] = [
    [BookOpen, stats.productos, '+', 'Platos en carta'],
    [Store, 4, '', 'Locales'],
    [Receipt, stats.pedidos, '+', 'Pedidos servidos'],
    [Users, stats.clientes, '+', 'Clientes felices'],
  ];

  return (
    <div className="flex flex-col w-full">
      {/* ============ HERO ============ */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" src={HERO_IMG} alt="Sumaq" />
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-surface" />
          <div className="qz-orb absolute top-24 left-[12%] w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="qz-orb d2 absolute bottom-32 right-[14%] w-56 h-56 rounded-full bg-tertiary/20 blur-3xl" />
          <div className="qz-orb d3 absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-8 flex flex-col items-center text-center max-w-4xl">
          <motion.span {...rise(0)} className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-md text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border border-outline-variant/30">
            <Sparkles className="w-4 h-4" /> Gastronomía andina saludable
          </motion.span>
          <motion.h1 {...rise(0.08)} className="font-display text-5xl md:text-7xl text-on-primary mb-6 drop-shadow-lg leading-tight">
            Gastronomía que nutre,<br />tradición que sana.
          </motion.h1>
          <motion.p {...rise(0.18)} className="font-sans text-lg md:text-xl text-on-primary/90 mb-10 max-w-2xl drop-shadow-sm">
            Descubre una experiencia culinaria premium que fusiona los superalimentos andinos con la alta cocina moderna. Diseñado para tu bienestar.
          </motion.p>
          <motion.div {...rise(0.28)} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/menu" className="qz-cta bg-primary text-on-primary font-semibold px-10 py-4 rounded-full shadow-lg shadow-primary/20 text-center inline-flex items-center justify-center gap-2 group">Ver menú <span className="qz-arrow inline-flex"><ArrowRight className="w-4 h-4" /></span></Link>
            <Link to="/menu" className="qz-cta bg-surface text-primary border border-primary font-semibold px-10 py-4 rounded-full text-center">Realizar pedido</Link>
          </motion.div>
        </div>

        <a href="#destacados" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-on-primary/70 hover:text-on-primary">
          <span className="qz-bounce inline-flex"><ChevronDown className="w-8 h-8" /></span>
        </a>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="bg-primary text-on-primary py-4 overflow-hidden qz-marquee-mask">
        <div className="flex w-max qz-marquee">
          {[0, 1].map(r => FOODS.map((f, i) => (
            <span key={`${r}-${i}`} className="inline-flex items-center gap-3 px-8 font-display text-xl"><Leaf className="w-4 h-4 opacity-70" /> {f}</span>
          )))}
        </div>
      </div>

      {/* ============ ESTADÍSTICAS ============ */}
      <section className="py-20 px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {tarjetas.map(([Icon, num, suf, lbl], i) => (
            <motion.div key={i} {...rise(i * 0.08)} className="qz-lift-sm bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
              <div className="text-primary flex justify-center mb-3"><Icon className="w-7 h-7" /></div>
              <div className="font-display text-4xl md:text-5xl text-on-surface font-bold"><CountUp to={num} suffix={suf} /></div>
              <p className="text-on-surface-variant text-sm font-semibold mt-2">{lbl}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PLATOS DESTACADOS ============ */}
      <section id="destacados" className="py-16 px-8 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <motion.div {...rise(0, 'left')}>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Los favoritos</span>
            <h2 className="font-display text-4xl md:text-5xl text-on-surface mt-2">Platos Destacados</h2>
          </motion.div>
          <motion.div {...rise(0, 'right')}>
            <Link to="/menu" className="group inline-flex items-center gap-2 text-primary font-semibold hover:underline">Ver todo el menú <span className="qz-arrow inline-flex"><ArrowRight className="w-4 h-4" /></span></Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destacados.map((p, i) => (
            <motion.div key={p.id} {...rise((i % 3) * 0.1)}>
              <Link to="/menu" className="qz-card group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xl shadow-primary/5 overflow-hidden flex flex-col h-full">
                <div className="h-52 overflow-hidden relative">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" className="qz-img w-full h-full object-cover" />
                  {p.tag && <span className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest">{p.tag}</span>}
                  {i === 0 && <span className="absolute top-3 left-3 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Flame className="w-3 h-3" /> Top ventas</span>}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{p.categoria?.nombre}</span>
                  <h3 className="font-display text-xl text-on-surface leading-tight mb-2">{p.nombre}</h3>
                  <p className="text-xs text-on-surface-variant mb-6 line-clamp-2">{p.descripcion}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-display text-2xl text-primary font-bold">{soles(p.precio)}</span>
                    <span className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors"><Plus className="w-5 h-5" /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className="py-24 px-8 bg-surface-container-low/50">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <motion.h2 {...rise(0)} className="font-display text-4xl md:text-5xl text-primary mb-4">¿Cómo funciona?</motion.h2>
            <motion.p {...rise(0.1)} className="text-on-surface-variant max-w-2xl mx-auto">Pedir tu comida saludable nunca fue tan simple.</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PASOS.map(([Icon, t, d], i) => (
              <motion.div key={i} {...rise(i * 0.12)} className="qz-lift-sm group text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-10 shadow-xl shadow-primary/5 relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-on-primary font-display font-bold flex items-center justify-center shadow-lg">{i + 1}</div>
                <div className="bg-primary/10 text-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-3"><span className="qz-icon-pop inline-flex"><Icon className="w-9 h-9" /></span></div>
                <h3 className="font-display text-xl text-on-surface mb-2">{t}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FILOSOFÍA (BENTO) ============ */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.h2 {...rise(0)} className="font-display text-4xl md:text-5xl text-primary mb-4">Filosofía Sumaq</motion.h2>
          <motion.p {...rise(0.1)} className="text-on-surface-variant max-w-2xl mx-auto">Nuestro compromiso con la calidad, la sostenibilidad y tu salud.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <motion.div {...rise(0, 'zoom')} className="qz-lift-sm qz-lift-lg group md:col-span-2 md:row-span-2 bg-surface-container-low rounded-3xl border border-outline-variant/30 p-10 shadow-xl shadow-primary/5 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" src={BENTO_IMG} alt="Superfoods" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-end">
              <div className="bg-surface/80 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/20 inline-block self-start mb-auto text-primary"><span className="qz-icon-pop inline-flex"><Leaf className="w-8 h-8" /></span></div>
              <h3 className="font-display text-3xl text-primary mt-6 mb-2">Ingredientes de Origen</h3>
              <p className="text-on-surface-variant max-w-md">Seleccionamos rigurosamente cada insumo, priorizando productores locales y prácticas agrícolas sostenibles en los Andes.</p>
            </div>
          </motion.div>
          <motion.div {...rise(0.1)} className="qz-lift-sm group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 flex flex-col">
            <div className="bg-secondary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6 text-secondary"><span className="qz-icon-pop inline-flex"><HeartPulse className="w-6 h-6" /></span></div>
            <h3 className="font-display text-xl text-on-surface mb-2">Nutrición Balanceada</h3>
            <p className="text-on-surface-variant text-sm">Menús diseñados por expertos para optimizar tu bienestar diario.</p>
          </motion.div>
          <motion.div {...rise(0.2)} className="qz-lift-sm group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 flex flex-col">
            <div className="bg-tertiary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6 text-tertiary"><span className="qz-icon-pop inline-flex"><Truck className="w-6 h-6" /></span></div>
            <h3 className="font-display text-xl text-on-surface mb-2">Logística Eficiente</h3>
            <p className="text-on-surface-variant text-sm">Entrega rápida y segura conservando la temperatura y calidad.</p>
          </motion.div>
          <motion.div {...rise(0.3)} className="qz-lift-sm group bg-primary text-on-primary rounded-3xl p-8 shadow-lg flex flex-col justify-center overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12"><span className="qz-float inline-flex"><Sprout className="w-40 h-40" /></span></div>
            <div className="relative z-10">
              <div className="mb-4"><Leaf className="w-8 h-8" /></div>
              <h3 className="font-display text-2xl mb-2">100% Sostenible</h3>
              <p className="text-on-primary/80 text-sm">Empaques compostables y cero desperdicio en toda nuestra operación.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIOS ============ */}
      <section className="py-24 px-8 bg-surface-container-low/50">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <motion.h2 {...rise(0)} className="font-display text-4xl md:text-5xl text-primary mb-4">Lo que dicen de nosotros</motion.h2>
            <motion.p {...rise(0.1)} className="text-on-surface-variant max-w-2xl mx-auto">Miles de comensales ya viven la experiencia Sumaq.</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map(([nom, loc, txt], i) => (
              <motion.div key={i} {...rise(i * 0.1)} className="group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 flex flex-col">
                <div className="flex gap-1 text-tertiary mb-4">
                  {Array.from({ length: 5 }).map((_, s) => <span key={s} className="qz-star inline-flex" style={{ transitionDelay: `${s * 0.03}s` }}><Star className="w-4 h-4 fill-current" /></span>)}
                </div>
                <p className="text-on-surface leading-relaxed mb-6 flex-grow">"{txt}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{nom.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{nom}</p>
                    <p className="text-xs text-on-surface-variant">{loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full">
        <motion.div {...rise(0, 'zoom')} className="relative overflow-hidden bg-primary text-on-primary rounded-[3rem] p-12 md:p-20 text-center shadow-2xl">
          <div className="qz-orb absolute -top-10 -left-10 w-48 h-48 rounded-full bg-on-primary/10 blur-3xl" />
          <div className="qz-orb d2 absolute -bottom-12 -right-8 w-56 h-56 rounded-full bg-tertiary/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-6xl mb-4 leading-tight">Tu próxima comida<br />saludable te espera</h2>
            <p className="text-on-primary/85 text-lg mb-10 max-w-xl mx-auto">Únete a Sumaq y transforma la forma en que comes, sin renunciar al sabor.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu" className="qz-cta bg-surface text-primary font-semibold px-10 py-4 rounded-full shadow-lg inline-flex items-center justify-center gap-2 group">Ordenar ahora <span className="qz-arrow inline-flex"><ArrowRight className="w-4 h-4" /></span></Link>
              <Link to="/historia" className="qz-cta bg-transparent border border-on-primary/40 text-on-primary font-semibold px-10 py-4 rounded-full">Conoce nuestra historia</Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
