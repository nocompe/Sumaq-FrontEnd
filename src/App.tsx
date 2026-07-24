import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './screens/LandingPage';
import MenuPage from './screens/MenuPage';
import ProductDetail from './screens/ProductDetail';
import HistoriaPage from './screens/HistoriaPage';
import SaludPage from './screens/SaludPage';
import LocalesPage from './screens/LocalesPage';
import CarritoPage from './screens/CarritoPage';
import SostenibilidadPage from './screens/SostenibilidadPage';
import TerminosPage from './screens/TerminosPage';
import PrivacidadPage from './screens/PrivacidadPage';
import ContactoPage from './screens/ContactoPage';
import AdminDashboard from './screens/AdminDashboard';
import KitchenDashboard from './screens/KitchenDashboard';
import CashierDashboard from './screens/CashierDashboard';
import ReportsDashboard from './screens/ReportsDashboard';
import CheckoutPage from './screens/CheckoutPage';
import ConfirmationPage from './screens/ConfirmationPage';
import LoginPage from './screens/LoginPage';
import MisPedidosPage from './screens/MisPedidosPage';
import ProfilePage from './screens/ProfilePage';
import PedidosAdmin from './screens/PedidosAdmin';
import ProductosAdmin from './screens/ProductosAdmin';
import UsuariosAdmin from './screens/UsuariosAdmin';
import CategoriasAdmin from './screens/CategoriasAdmin';
import AdminProfile from './screens/AdminProfile';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/salud" element={<SaludPage />} />
          <Route path="/historia" element={<HistoriaPage />} />
          <Route path="/locales" element={<LocalesPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/sostenibilidad" element={<SostenibilidadPage />} />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pedidos" element={<PedidosAdmin />} />
          <Route path="/admin/kitchen" element={<KitchenDashboard />} />
          <Route path="/admin/cashier" element={<CashierDashboard />} />
          <Route path="/admin/reports" element={<ReportsDashboard />} />
          <Route path="/admin/productos" element={<ProductosAdmin />} />
          <Route path="/admin/categorias" element={<CategoriasAdmin />} />
          <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
          <Route path="/admin/perfil" element={<AdminProfile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
