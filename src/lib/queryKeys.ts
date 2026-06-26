export const queryKeys = {
  me: ["auth", "me"] as const,
  dashboard: ["admin", "dashboard"] as const,
  users: (params: unknown) => ["admin", "users", params] as const,
  user: (userId: string) => ["admin", "user", userId] as const,
  userSubscriptions: (userId: string, params: unknown) => ["admin", "user", userId, "subscriptions", params] as const,
  userPayments: (userId: string, params: unknown) => ["admin", "user", userId, "payments", params] as const,
  payments: (params: unknown) => ["admin", "payments", params] as const,
  payment: (paymentTransactionId: string) => ["admin", "payment", paymentTransactionId] as const,
  plans: ["admin", "subscription-plans"] as const,
  careSchedule: ["admin", "background-jobs", "care-task-generation", "schedule"] as const
};
