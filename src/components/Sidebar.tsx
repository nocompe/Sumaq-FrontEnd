import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, CookingPot, Wallet, BarChart3, Box, Tags, Users, LogOut, ExternalLink, LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { FC } from 'react';
import { useAuth } from '../context/AuthContext';

const items: { name: string; href: string; key: string; icon: LucideIcon }[] = [
  { name: 'Dashboard', href: '/admin', key: 'index', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/admin/pedidos', key: 'pedidos', icon: Receipt },
  { name: 'Cocina', href: '/admin/kitchen', key: 'cocina', icon: CookingPot },
  { name: 'Caja', href: '/admin/cashier', key: 'caja', icon: Wallet },
  { name: 'Reportes', href: '/admin/reports', key: 'reportes', icon: BarChart3 },
  { name: 'Productos', href: '/admin/productos', key: 'productos', icon: Box },
  { name: 'Categorías', href: '/admin/categorias', key: 'categorias', icon: Tags },
  { name: 'Usuarios', href: '/admin/usuarios', key: 'usuarios', icon: Users },
];

const Sidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const allowed = user?.paginas ?? [];
  const rolLabel: Record<string, string> = { admin: 'Administrador', cajero: 'Cajero', cocina: 'Cocina', mesero: 'Mesero' };

  const doLogout = async () => { await logout(); navigate('/'); };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-surface-container-low/95 backdrop-blur-2xl border-r border-outline-variant/20 shadow-xl shadow-primary/5 flex flex-col p-4">
      <div className="mb-8 px-2 mt-4">
        <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Sumaq Admin</h1>
        <p className="font-sans text-xs font-medium text-on-surface-variant">Gestión Premium</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
        {items.filter(it => allowed.includes(it.key)).map(item => {
          const active = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} to={item.href} className={cn(
              "group relative flex items-center gap-3.5 pl-5 pr-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              active ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-primary/5 hover:text-primary hover:translate-x-0.5"
            )}>
              <span className={cn("absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-primary transition-transform duration-200 origin-center", active ? "hidden" : "scale-y-0 group-hover:scale-y-100")} />
              <Icon size={20} className="shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-outline-variant/40">
        <div className="bg-surface rounded-2xl border border-outline-variant/30 p-3 shadow-sm">
          {user && (
            <Link to="/admin/perfil" title="Editar perfil" className={cn("flex items-center gap-3 mb-3 -m-1 p-1 rounded-xl transition-colors hover:bg-surface-variant/60", location.pathname === '/admin/perfil' && 'bg-surface-variant/60')}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=ffffff&bold=true&size=80`} className="w-11 h-11 rounded-full border-2 border-primary/30" alt="" />
              <div className="min-w-0"><p className="text-sm font-semibold text-on-surface truncate">{user.name}</p><p className="text-[11px] font-bold text-primary uppercase tracking-wide">{rolLabel[user.rol] || 'Staff'}</p></div>
            </Link>
          )}
          <div className="flex gap-2">
            <Link to="/" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-on-surface-variant bg-surface-variant/50 hover:bg-surface-variant rounded-lg py-2"><ExternalLink size={14} /> Sitio</Link>
            <button onClick={doLogout} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-on-surface-variant bg-surface-variant/50 hover:bg-error-container hover:text-error rounded-lg py-2"><LogOut size={14} /> Salir</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
