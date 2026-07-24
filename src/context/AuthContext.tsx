import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setToken, getToken } from '../lib/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  rol: 'cliente' | 'admin' | 'cajero' | 'cocina' | 'mesero';
  telefono?: string | null;
  direccion?: string | null;
  es_staff: boolean;
  es_admin: boolean;
  paginas: string[];
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: Record<string, any>) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateUser: (u: AuthUser) => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.get<{ user: AuthUser }>('/me')
      .then(r => setUser(r.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post<{ token: string; user: AuthUser }>('/login', { email, password });
    setToken(r.token);
    setUser(r.user);
    return r.user;
  };

  const register = async (data: Record<string, any>) => {
    const r = await api.post<{ token: string; user: AuthUser }>('/register', data);
    setToken(r.token);
    setUser(r.user);
    return r.user;
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout, updateUser: setUser }}>{children}</Ctx.Provider>;
}
