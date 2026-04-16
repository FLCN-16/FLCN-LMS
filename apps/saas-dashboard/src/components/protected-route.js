import { Navigate } from "react-router-dom";
import { AppLoader } from "@/components/loader";
import { AUTH_DISABLED } from "@/constants/auth";
import useAuth from "@/features/auth/use-auth.hook";
export function ProtectedRoute({ children, permission, }) {
    const { isLoading, isAuthenticated, isAuthorized } = useAuth(permission);
    if (AUTH_DISABLED) {
        return <>{children}</>;
    }
    if (isLoading) {
        return <AppLoader />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace/>;
    }
    if (!isAuthorized) {
        return <Navigate to="/panel" replace/>;
    }
    return <>{children}</>;
}
