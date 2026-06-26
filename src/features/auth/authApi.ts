import { apiClient } from "../../lib/apiClient";
import type { ApiResponse } from "../../types/api";
import type { AdminUser } from "../../types/admin";
import type { LoginPayload, LoginResponse } from "../../types/auth";

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse> | LoginResponse>("/api/auth/login", payload);
  return ("data" in data && data.data ? data.data : data) as LoginResponse;
}

export async function getMe() {
  const { data } = await apiClient.get<ApiResponse<AdminUser>>("/api/users/me");
  return data.data;
}
