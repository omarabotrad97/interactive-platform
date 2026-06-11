import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface RoleProtectedRouteProps {
    allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

export default function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
    const { isAuthenticated, user } = useStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user.role === 'teacher' && user.isApproved === false && location.pathname !== '/auth/pending') {
        return <Navigate to="/auth/pending" replace />;
    }

    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
