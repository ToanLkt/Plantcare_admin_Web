export type AdminUserRole = "Admin" | "Personal" | "Garden" | string;
export type AdminUserStatus = "Active" | "Locked" | string;
export type PlanCode = "Free" | "Plus" | "Pro" | "Garden" | string;

export type AdminUser = {
  id: number | string;
  userId?: number | string;
  userID?: number | string;
  _id?: number | string;
  fullName?: string;
  name?: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  planCode?: PlanCode;
  currentPlan?: { code: PlanCode; name?: string };
  phone?: string;
  address?: string;
  plantCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type UserSubscription = {
  userSubscriptionId?: number | string;
  userId?: number | string;
  id?: number | string;
  _id?: number | string;
  planCode?: PlanCode;
  status?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  plan?: { code?: PlanCode; name?: string };
  plantUsage?: { used?: number; limit?: number; remaining?: number };
  aiUsage?: { used?: number; limit?: number; remaining?: number };
};

export type PaymentTransaction = {
  paymentTransactionId: number | string;
  id?: number | string;
  userId?: number | string;
  userID?: number | string;
  _id?: number | string;
  userEmail?: string;
  planCode: PlanCode;
  provider: string;
  orderCode?: string;
  amount: number;
  currency?: string;
  status: string;
  checkoutUrl?: string;
  createdAt?: string;
  paidAt?: string;
  expiresAt?: string;
  rawMessage?: string;
  metadata?: unknown;
};

export type SubscriptionPlan = {
  code: PlanCode;
  id?: number | string;
  _id?: number | string;
  name: string;
  price: number;
  currency?: string;
  billingCycle?: string;
  maxPlants?: number;
  aiQuotaLimit?: number;
  aiQuotaPeriod?: string;
  showAds?: boolean;
  isActive?: boolean;
  planGroup?: string;
  description?: string;
  features?: string[];
};

export type CareTaskGenerationSchedule = {
  jobName: string;
  dailyRunTime: string;
  timeZone: string;
  nextRunAt: string;
};

export type AdminDashboard = {
  totalUsers?: StatValue;
  activeUsers?: StatValue;
  lockedUsers?: StatValue;
  totalPayments?: StatValue;
  paidPayments?: StatValue;
  pendingPayments?: StatValue;
  failedPayments?: StatValue;
  expiredPayments?: StatValue;
  totalRevenue?: StatValue;
  paidRevenueTotal?: StatValue;
  paidRevenueToday?: StatValue;
  paidRevenueThisMonth?: StatValue;
  aiUsageToday?: StatValue;
  aiUsageThisMonth?: StatValue;
  usersByRole?: ChartValue;
  usersByPlan?: ChartValue;
  paymentsByStatus?: ChartValue;
  recentUsers?: AdminUser[];
  recentPayments?: PaymentTransaction[];
};

export type StatValue = number | string | { key?: string; count?: number | string };
export type ChartValue = Record<string, number> | Array<{ key?: string; count?: number | string }>;
