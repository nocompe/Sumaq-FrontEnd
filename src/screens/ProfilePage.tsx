import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/ProfileForm';

const ProfilePage: FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center"><p className="text-on-surface-variant mb-6">Inicia sesión para ver tu perfil.</p><Link to="/login" className="bg-primary text-on-primary font-semibold px-6 py-3 rounded-full">Ingresar</Link></div>;
  }

  return (
    <div className="pt-28 pb-24 px-8 max-w-2xl mx-auto w-full">
      <h1 className="font-display text-4xl text-primary mb-2">Mi Perfil</h1>
      <p className="text-on-surface-variant mb-8">{user.email} · <span className="capitalize">{user.rol}</span></p>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
