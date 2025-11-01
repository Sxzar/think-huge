import { useEffect, useState } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';
import { me, login as apiLogin, logout as apiLogout } from '../api/auth';
import { setCsrf } from '../api/http';
import type { Admin, LoginResponse } from '../types/auth';

type MeResponse = {
  admin: Admin;
  csrf: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [csrf, setCsrfState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await me() as MeResponse;
        setAdmin(data.admin);
        setCsrfState(data.csrf);
        setCsrf(data.csrf);
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      const res = await apiLogin(email, password) as LoginResponse;
      // backend returns { ok, csrf, email }
      setAdmin({ id: 0, email: res.email }); // or change backend to return admin
      setCsrfState(res.csrf);
      setCsrf(res.csrf);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
      throw e;
    }
  }

  async function logout() {
    await apiLogout();
    setAdmin(null);
    setCsrfState(null);
    setCsrf(null);
  }

  const value: AuthContextValue = { admin, csrf, loading, error, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
