import { apiClient } from "../../lib/apiClient";
import type { ApiResponse, PaginatedParams } from "../../types/api";
import type {
  AdminDashboard,
  AdminUser,
  CareTaskGenerationSchedule,
  PaymentTransaction,
  PlanCode,
  SubscriptionPlan,
  UserSubscription
} from "../../types/admin";

export type UserListParams = PaginatedParams & { role?: string; status?: string; planCode?: string; sort?: string };
export type PaymentListParams = PaginatedParams & { status?: string; provider?: string; planCode?: string };

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== "" && value != null));

export async function getAdminDashboard() {
  const { data } = await apiClient.get<ApiResponse<AdminDashboard>>("/api/admin/dashboard");
  return data.data;
}

export async function getAdminUsers(params: UserListParams) {
  const query = cleanParams({
    Search: params.search,
    Role: params.role,
    Status: params.status,
    PlanCode: params.planCode,
    Sort: params.sort,
    Page: params.page,
    PageSize: params.pageSize
  });
  const { data } = await apiClient.get<ApiResponse<AdminUser[]>>("/api/admin/users", { params: query });
  return data;
}

export async function getAdminUserDetail(userId: string) {
  const { data } = await apiClient.get<ApiResponse<AdminUser>>(`/api/admin/users/${userId}`);
  return data.data;
}

export async function getAdminUserSubscriptions(userId: string, params: PaginatedParams) {
  const { data } = await apiClient.get<ApiResponse<UserSubscription[]>>(`/api/admin/users/${userId}/subscriptions`, {
    params: cleanParams({ Search: params.search, Page: params.page, PageSize: params.pageSize })
  });
  return data;
}

export async function getAdminUserPayments(userId: string, params: PaymentListParams) {
  const { data } = await apiClient.get<ApiResponse<PaymentTransaction[]>>(`/api/admin/users/${userId}/payments`, {
    params: cleanParams({
      Search: params.search,
      Status: params.status,
      Provider: params.provider,
      PlanCode: params.planCode,
      Page: params.page,
      PageSize: params.pageSize
    })
  });
  return data;
}

export async function getAdminPayments(params: PaymentListParams) {
  const { data } = await apiClient.get<ApiResponse<PaymentTransaction[]>>("/api/admin/payments", {
    params: cleanParams(params)
  });
  return data;
}

export async function getAdminPaymentDetail(paymentTransactionId: string) {
  const { data } = await apiClient.get<ApiResponse<PaymentTransaction>>(`/api/admin/payments/${paymentTransactionId}`);
  return data.data;
}

export async function getAdminSubscriptionPlans() {
  const { data } = await apiClient.get<ApiResponse<SubscriptionPlan[]>>("/api/admin/subscription-plans");
  return data.data;
}

export async function updateAdminSubscriptionPlan(planCode: string, payload: Partial<SubscriptionPlan>) {
  const { data } = await apiClient.patch<ApiResponse<SubscriptionPlan>>(`/api/admin/subscription-plans/${planCode}`, payload);
  return data.data;
}

export async function getCareTaskGenerationSchedule() {
  const { data } = await apiClient.get<ApiResponse<CareTaskGenerationSchedule>>(
    "/api/admin/background-jobs/care-task-generation/schedule"
  );
  return data.data;
}

export async function updateCareTaskGenerationSchedule(dailyRunTime: string) {
  const { data } = await apiClient.put<ApiResponse<CareTaskGenerationSchedule>>(
    "/api/admin/background-jobs/care-task-generation/schedule",
    { dailyRunTime }
  );
  return data.data;
}

export async function updateAdminUserRole(userId: string, role: string) {
  const { data } = await apiClient.put<ApiResponse<AdminUser>>(`/api/admin/users/${userId}/role`, { role });
  return data.data;
}

export async function updateAdminUserStatus(userId: string, status: string) {
  const { data } = await apiClient.put<ApiResponse<AdminUser>>(`/api/admin/users/${userId}/status`, { status });
  return data.data;
}

export async function updateAdminUserPlan(userId: string, planCode: PlanCode) {
  const { data } = await apiClient.put<ApiResponse<UserSubscription>>(`/api/admin/users/${userId}/plan`, { planCode });
  return data.data;
}
