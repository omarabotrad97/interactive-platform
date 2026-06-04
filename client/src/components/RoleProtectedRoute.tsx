import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface RoleProtectedRouteProps {
    allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

export default function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
    const { isAuthenticated, user } = useStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
