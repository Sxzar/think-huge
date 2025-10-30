import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  return admin ? <>{children}</> : <Navigate to="/login" replace />;
}
