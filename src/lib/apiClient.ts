import axios, { AxiosError } from "axios";
import { config } from "./config";
import { clearStoredSession, getStoredToken } from "../features/auth/authStorage";

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.request.use((request) => {
  const token = getStoredToken();
  const isAuthEndpoint = request.url?.startsWith("/api/auth/");
  if (token && !isAuthEndpoint) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearStoredSession();
      window.dispatchEvent(new Event("plantcare:session-expired"));
    }
    if (error.response?.status === 403) {
      window.dispatchEvent(new Event("plantcare:access-denied"));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown, fallback = "Request failed. Please try again.") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: unknown } | undefined;
    if (data?.message) return data.message;
    if (typeof data?.errors === "string") return data.errors;
    if (error.message) return error.message;
  }
  return fallback;
}
