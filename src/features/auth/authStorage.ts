import type { AdminUser } from "../../types/admin";

const tokenKey = "plantcare.admin.accessToken";
const refreshTokenKey = "plantcare.admin.refreshToken";
const userKey = "plantcare.admin.user";

export function getStoredToken() {
  return localStorage.getItem(tokenKey);
}

export function saveSession(accessToken: string, user: AdminUser, refreshToken?: string) {
  localStorage.setItem(tokenKey, accessToken);
  localStorage.setItem(userKey, JSON.stringify(user));
  if (refreshToken) localStorage.setItem(refreshTokenKey, refreshToken);
}

export function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function clearStoredSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);
  localStorage.removeItem(userKey);
}
