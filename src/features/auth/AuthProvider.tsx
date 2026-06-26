import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, login as loginRequest } from "./authApi";
import { clearStoredSession, getStoredToken, getStoredUser, saveSession } from "./authStorage";
import { queryClient } from "../../lib/queryClient";
import type { AdminUser } from "../../types/admin";

type AuthContextValue = {
  token: string | null;
  user: AdminUser | null;
  isRestoring: boolean;
  accessDenied: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function extractToken(response: Record<string, unknown>) {
  return String(response.accessToken || response.token || response.jwt || response.access_token || "");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [isRestoring, setIsRestoring] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearStoredSession();
    queryClient.clear();
    setToken(null);
    setUser(null);
    setAccessDenied(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const onExpired = () => logout();
    const onDenied = () => setAccessDenied(true);
    window.addEventListener("plantcare:session-expired", onExpired);
    window.addEventListener("plantcare:access-denied", onDenied);
    return () => {
      window.removeEventListener("plantcare:session-expired", onExpired);
      window.removeEventListener("plantcare:access-denied", onDenied);
    };
  }, [logout]);

  useEffect(() => {
    let active = true;
    async function restore() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setIsRestoring(false);
        return;
      }
      try {
        const currentUser = getStoredUser() || (await getMe());
        if (!active) return;
        setToken(storedToken);
        setUser(currentUser);
        setAccessDenied(currentUser.role !== "Admin");
      } catch {
        if (active) logout();
      } finally {
        if (active) setIsRestoring(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest({ email, password });
    const accessToken = extractToken(response as Record<string, unknown>);
    if (!accessToken) throw new Error("Login response did not include an access token.");
    const refreshToken = String(response.refreshToken || response.refresh_token || "");
    const currentUser = response.user || (await getMe());
    saveSession(accessToken, currentUser, refreshToken || undefined);
    setToken(accessToken);
    setUser(currentUser);
    setAccessDenied(currentUser.role !== "Admin");
    if (currentUser.role !== "Admin") return;
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isRestoring,
      accessDenied,
      isAdmin: user?.role === "Admin",
      login,
      logout
    }),
    [accessDenied, isRestoring, login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
