import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getRoleFromToken } from '../utils/auth';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

export default function ProtectedRoute({ requiredRoles }: ProtectedRouteProps) {
  const isAuth = isAuthenticated();
  const userRole = getRoleFromToken();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    // If authenticated but wrong role, redirect to unauthorized or home
    return <Navigate to="/customer/home" replace />;
  }

  return <Outlet />;
}
