import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Leaf, 
  Flame, 
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { PRODUCTS } from '../constants';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { FC } from 'react';

const ProductDetail: FC = () => {
  const product: Product = PRODUCTS[0]; // Example: Bowl Andino Imperial
  
  return (
    <div className="pt-28 pb-24 px-8 max-w-7xl mx-auto w-full font-sans">
      <Link to="/menu" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm mb-10 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Volver al Menú
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left: Image Canvas */}
        <div className="md:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5 border border-outline-variant/30 bg-surface-container-low"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex gap-3">
              <span className="bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-outline-variant/30 text-xs font-bold text-on-surface-variant flex items-center gap-2 shadow-sm">
                <Leaf size={14} className="text-primary" /> Vegano
              </span>
              <span className="bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-outline-variant/30 text-xs font-bold text-on-surface-variant flex items-center gap-2 shadow-sm">
                <Flame size={14} className="text-secondary" /> Alto en Proteína
              </span>
            </div>
          </motion.div>

          <div className="flex gap-4">
            {([1, 2] as const).map((i: number) => (
              <div key={i} className={`w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${i === 1 ? 'border-primary' : 'border-outline-variant/20 opacity-60 hover:opacity-100'}`}>
                <img src={product.image} className="w-full h-full object-cover" alt="View" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content & Order */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-5 bg-surface-container-lowest rounded-[2rem] p-10 shadow-2xl shadow-primary/5 border border-outline-variant/10 sticky top-28"
        >
          <div className="mb-8">
            <h1 className="font-display text-4xl text-on-surface mb-2 leading-tight">Bowl Andino Imperial</h1>
            <p className="font-display text-3xl text-primary font-bold">S/ 38.00</p>
          </div>

          <p className="text-on-surface-variant mb-10 leading-relaxed">
            Una sinfonía de nutrientes ancestrales. Quinoa perlada de los Andes, vegetales de temporada asados con finas hierbas, palta fuerte en su punto, y nuestro aderezo exclusivo de muña y limón.
          </p>

          {/* Nutritional Bento */}
          <div className="grid grid-cols-4 gap-2 mb-10">
            {[
              { label: 'Calorías', val: '420' },
              { label: 'Proteína', val: '18g' },
              { label: 'Carbos', val: '45g' },
              { label: 'Grasas', val: '12g' }
            ].map((stat: { label: string; val: string }) => (
              <div key={stat.label} className="bg-surface-container-low p-3 rounded-2xl text-center border border-outline-variant/10">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="block font-display font-bold text-on-surface">{stat.val}</span>
              </div>
            ))}
          </div>

          <hr className="border-outline-variant/20 mb-8" />

          <div className="space-y-6">
            <div>
              <label className="block font-bold text-on-surface text-sm mb-3 flex items-center gap-2">
                <Edit3 size={16} className="text-outline" /> Instrucciones Especiales
              </label>
              <textarea 
                className="w-full bg-surface border border-outline-variant/40 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-outline/50"
                placeholder="Ej: Sin cebolla, aderezo aparte..."
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end pt-4">
              <div className="w-full sm:w-auto">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Cantidad</label>
                <div className="flex items-center bg-surface border border-outline-variant/40 rounded-2xl h-14 px-2">
                  <button className="p-3 text-on-surface-variant hover:text-primary transition-colors"><Minus size={18}/></button>
                  <span className="font-display font-bold px-4">1</span>
                  <button className="p-3 text-on-surface-variant hover:text-primary transition-colors"><Plus size={18}/></button>
                </div>
              </div>
              <button className="w-full bg-primary text-on-primary font-bold h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <ShoppingBag size={20} /> Agregar al pedido
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant/60">
            <ShieldCheck size={14} /> Garantía de frescura Sumaq
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
