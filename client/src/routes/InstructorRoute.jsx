import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function InstructorRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'instructor' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
