import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
