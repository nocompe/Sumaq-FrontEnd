import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowRight, LucideIcon } from 'lucide-react';
import { rise } from '../lib/reveal';

const canales: [LucideIcon, string, string, string, string][] = [
  [Mail, 'Correo', 'hola@sumaq.pe', 'mailto:hola@sumaq.pe', 'Te respondemos en menos de 24 h hábiles.'],
  [Phone, 'Teléfono', '(01) 445-8820', 'tel:+5114458820', 'Lun a Dom · 8:00 – 22:00'],
  [MessageCircle, 'WhatsApp', '+51 999 000 111', 'https://wa.me/51999000111', 'Para pedidos y consultas rápidas.'],
];

const motivos = [
  'Consulta sobre un pedido en curso',
  'Problema con una entrega o un producto',
  'Solicitud de datos o eliminación de cuenta',
  'Eventos, catering y pedidos corporativos',
  'Trabaja con nosotros',
];

const ContactoPage: FC = () => (
  <div className="bg-surface">
    <section className="pt-28 pb-14 px-8 max-w-5xl mx-auto w-full text-center">
      <motion.span {...rise(0)} className="inline-block bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Contacto</motion.span>
      <motion.h1 {...rise(0.08)} className="font-display text-5xl md:text-6xl text-on-surface mb-6 leading-tight">Hablemos</motion.h1>
      <motion.p {...rise(0.16)} className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
        ¿Tienes una consulta, una sugerencia o algo que mejorar? Escríbenos por el canal que prefieras: somos un equipo pequeño y leemos todo.
      </motion.p>
    </section>

    <section className="pb-16 px-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {canales.map(([Icon, titulo, valor, href, nota], i) => (
          <motion.a
            key={i} {...rise(i * 0.1)} href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
            className="group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5 qz-hover block"
          >
            <div className="bg-primary/10 text-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6"><Icon className="w-7 h-7" /></div>
            <h3 className="font-display text-lg text-on-surface mb-1">{titulo}</h3>
            <p className="font-semibold text-primary mb-2 group-hover:underline">{valor}</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">{nota}</p>
          </motion.a>
        ))}
      </div>
    </section>

    <section className="pb-20 px-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...rise(0, 'left')} className="bg-surface-container-low rounded-3xl border border-outline-variant/30 p-8">
          <h2 className="font-display text-2xl text-on-surface mb-6">¿Sobre qué nos escribes?</h2>
          <ul className="space-y-3 mb-8">
            {motivos.map((m, i) => (
              <li key={i} className="flex gap-3 text-on-surface-variant text-sm leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{m}
              </li>
            ))}
          </ul>
          <a href="mailto:hola@sumaq.pe?subject=Consulta%20desde%20la%20web" className="qz-cta inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-8 py-4 rounded-full">
            Escribirnos <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div {...rise(0, 'right')} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 shadow-xl shadow-primary/5">
          <h2 className="font-display text-2xl text-on-surface mb-6">Local principal</h2>
          <ul className="space-y-4 text-sm text-on-surface-variant mb-6">
            <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Av. La Paz 1045, Miraflores, Lima</li>
            <li className="flex items-start gap-3"><Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Lun a Dom · 8:00 – 22:00</li>
            <li className="flex items-start gap-3"><Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" /> (01) 445-8820</li>
          </ul>
          <div className="h-36 rounded-2xl bg-surface-variant/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/50 gap-2 mb-6">
            <MapPin className="w-5 h-5" /> <span className="text-xs font-semibold">Mapa referencial</span>
          </div>
          <Link to="/locales" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            Ver todos nuestros locales <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default ContactoPage;
