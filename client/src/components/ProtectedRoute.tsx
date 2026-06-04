import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function ProtectedRoute() {
    const { isAuthenticated } = useStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}
