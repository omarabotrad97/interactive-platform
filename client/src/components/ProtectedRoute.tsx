import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function ProtectedRoute() {
    const { isAuthenticated, user } = useStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user.role === 'teacher' && user.isApproved === false && location.pathname !== '/auth/pending') {
        return <Navigate to="/auth/pending" replace />;
    }

    return <Outlet />;
}
