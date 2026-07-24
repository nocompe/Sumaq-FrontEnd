import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { FC } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const navLinks = [
    { name: 'Menú', href: '/menu' },
    { name: 'Salud', href: '/salud' },
    { name: 'Historia', href: '/historia' },
    { name: 'Locales', href: '/locales' },
  ];

  const doLogout = async () => { await logout(); navigate('/'); };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-2xl font-bold text-primary">
            Sumaq
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map(link => (
              <Link key={link.name} to={link.href} className={cn("font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-all px-2 py-1 rounded-lg", location.pathname === link.href && "text-primary")}>{link.name}</Link>
            ))}
            {user && <Link to="/mis-pedidos" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary px-2 py-1">Mis Pedidos</Link>}
            {user?.es_staff && <Link to="/admin" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary px-2 py-1">Panel</Link>}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/menu" className="hidden md:flex bg-primary text-on-primary text-sm font-semibold px-6 py-2 rounded-full hover:scale-95 transition-transform">Pedir Ahora</Link>
          <Link to="/carrito" className="relative p-2 text-on-surface-variant hover:text-primary rounded-lg">
            <ShoppingCart size={20} />
            {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/perfil" className="hidden sm:inline text-sm font-semibold text-on-surface-variant hover:text-primary">Hola, {user.name.split(' ')[0]}</Link>
              <button onClick={doLogout} className="p-2 text-on-surface-variant hover:text-secondary rounded-lg" title="Salir"><LogOut size={20} /></button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold pl-3 pr-4 py-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
              <User size={16} /> <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
