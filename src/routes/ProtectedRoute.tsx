import { Navigate, Outlet } from "react-router-dom";
import { AccessDenied } from "./AccessDenied";
import { useAuth } from "../features/auth/AuthProvider";

export function ProtectedRoute() {
  const { token, isRestoring, accessDenied, isAdmin } = useAuth();
  if (isRestoring) return <div className="p-8 text-sm text-forest-900">Restoring admin session...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (accessDenied || !isAdmin) return <AccessDenied />;
  return <Outlet />;
}
