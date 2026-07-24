import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-surface-container-highest w-full py-12 border-t border-outline-variant/50">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
        <div className="font-display text-2xl font-bold text-primary">Sumaq</div>
        <p className="text-on-surface-variant text-sm">© {new Date().getFullYear()} Sumaq. Nutriendo el espíritu, honrando la tierra.</p>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
          <Link to="/sostenibilidad" className="text-on-surface-variant hover:text-secondary transition-colors">Sostenibilidad</Link>
          <Link to="/terminos" className="text-on-surface-variant hover:text-secondary transition-colors">Términos</Link>
          <Link to="/privacidad" className="text-on-surface-variant hover:text-secondary transition-colors">Privacidad</Link>
          <Link to="/contacto" className="text-on-surface-variant hover:text-secondary transition-colors">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
