import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";

export function PublicOnlyRoute() {
  const { token, isAdmin, isRestoring } = useAuth();
  if (isRestoring) return <div className="p-8 text-sm text-forest-900">Restoring admin session...</div>;
  if (token && isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
