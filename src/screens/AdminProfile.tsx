import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { UserCog } from 'lucide-react';

const AdminProfile: FC = () => {
  const { user, loading: authLoading } = useAuth();
  if (!authLoading && (!user || !user.es_staff)) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-8 flex items-center gap-4 qz-up">
          <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><UserCog size={28} /></span>
          <div>
            <h1 className="font-display text-4xl text-on-surface">Mi Perfil</h1>
            <p className="text-on-surface-variant">{user?.email} · <span className="capitalize">{user?.rol}</span></p>
          </div>
        </header>
        <div className="max-w-2xl qz-up">
          {user ? <ProfileForm key={user.id} /> : <p className="text-on-surface-variant">Cargando…</p>}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
