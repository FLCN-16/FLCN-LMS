import { Navigate, Outlet } from "react-router-dom"

// TODO: replace with real auth check (e.g. token from store/cookie)
function useIsAuthenticated() {
    return true
}

function ProtectedRoute() {
    const isAuthenticated = useIsAuthenticated()
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />
}

export default ProtectedRoute
