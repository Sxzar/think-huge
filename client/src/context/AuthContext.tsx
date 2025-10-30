import { createContext } from 'react';
import type { Admin } from '../types/auth';

export type AuthContextValue = {
  admin: Admin | null;
  csrf: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  admin: null,
  csrf: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
});
