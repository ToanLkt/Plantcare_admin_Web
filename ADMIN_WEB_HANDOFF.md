# PlantCare Hub Admin Web Handoff

This document is for Antigravity to build a separate desktop-first Admin Web app for PlantCare Hub.

Do not build this admin web inside the current Expo app. Do not refactor the mobile app. Use this repository only as API, auth, type, and UI reference.

Expected admin domain: `admin.plantcarehub.id.vn`

When users open the admin domain, they should see the Admin Login page first. After successful admin login, admin users can access the dashboard. Non-admin users must be blocked with an Access Denied screen and logout action.

## 1. Project Context

Current app type and stack:

- Expo React Native app using `expo-router`.
- React 19.1, React Native 0.81, Expo SDK 54.
- TypeScript.
- TanStack Query v5.
- Axios API client.
- Zustand auth/session store.
- Native token persistence uses `expo-secure-store`.
- Existing reset-password web app exists under `reset-password-web/`, but this handoff is for a new separate `admin-web/`.

Current API/base URL setup:

- Source: `src/constants/config.ts`
- Default API base URL: `https://api.plantcarehub.id.vn`
- Environment override: `EXPO_PUBLIC_API_BASE_URL`
- `API_BASE_URL` normalizes protocol and strips trailing slash.
- `CONFIG.useMockData` is currently `true`, but the admin API services call real backend endpoints through `apiClient`.

Current auth/session/token flow:

- Login endpoint: `POST /api/auth/login`
- Login payload: `{ email: string; password: string }`
- Login response token can be one of: `accessToken`, `token`, `jwt`, or `access_token`.
- Refresh token can be one of: `refreshToken` or `refresh_token`.
- Login response may include `user`; if missing, the app calls `GET /api/users/me`.
- Current user endpoint: `GET /api/users/me`
- API client attaches `Authorization: Bearer <accessToken>` to non-auth endpoints.
- Existing mobile app stores tokens in SecureStore. Admin Web should use a browser-safe strategy; recommended: in-memory access token plus carefully scoped storage if persistence is required. Backend support for httpOnly cookies is unknown / needs backend confirmation.
- Admin permission check in source is `user?.role === "Admin"` from `src/utils/admin.ts`.

Important files Antigravity should read first:

- `src/constants/config.ts`
- `src/constants/queryKeys.ts`
- `src/services/apiClient.ts`
- `src/services/authApi.ts`
- `src/services/userApi.ts`
- `src/services/adminApi.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useAdmin.ts`
- `src/hooks/useAdminAccess.ts`
- `src/stores/authStore.ts`
- `src/types/api.ts`
- `src/types/auth.ts`
- `src/types/user.ts`
- `src/types/admin.ts`
- `src/utils/admin.ts`
- Existing admin screen references:
  - `app/(admin)/_layout.tsx`
  - `src/screens/admin/AdminDashboardPremiumScreen.tsx`
  - `src/screens/admin/AdminUsersScreen.tsx`
  - `src/screens/admin/AdminUserDetailScreen.tsx`
  - `src/screens/admin/AdminPaymentsScreen.tsx`
  - `src/screens/admin/AdminPaymentDetailScreen.tsx`
  - `src/screens/admin/AdminPlansScreen.tsx`
  - `src/screens/admin/AdminSettingsScreen.tsx`

## 2. Existing Admin API Inventory

All response wrappers use:

```ts
type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data: T;
  pagination?: PaginationMeta;
  errors?: string | unknown;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
```

| Feature/module | Query key | Source file | Endpoint/function | Params | Response/type if known | Suggested admin web page |
|---|---|---|---|---|---|---|
| Dashboard | `adminDashboard`: `["admin","dashboard"]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminDashboard()` -> `GET /api/admin/dashboard` | none | `ApiResponse<AdminDashboardData>` | `/dashboard` |
| Users base invalidation | `adminUsers`: `["admin","users"]` | `src/constants/queryKeys.ts`, `src/hooks/useAdmin.ts` | Used for invalidation after role/status/plan changes | none | n/a | `/users` |
| Users list | `adminUsersList(params)`: `["admin","users",params]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminUsers(params)` -> `GET /api/admin/users` | API query maps to `Role`, `Status`, `PlanCode`, `Search`, `Sort`, `Fields`, `Expand`, `Page`, `PageSize` | `ApiResponse<AdminUser[]>` with optional pagination | `/users` |
| User detail | `adminUserDetail(userId)`: `["admin","user",userId]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminUserDetail(userId)` -> `GET /api/admin/users/{userId}` | `userId` path param | `ApiResponse<AdminUser>` | `/users/:userId` |
| User subscriptions | `adminUserSubscriptions(userId, params)`: `["admin","user",userId,"subscriptions",params]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminUserSubscriptions(userId, params)` -> `GET /api/admin/users/{userId}/subscriptions` | `Search`, `Sort`, `Fields`, `Expand`, `Page`, `PageSize` | `ApiResponse<AdminUserSubscription[]>` | `/users/:userId/subscriptions` and user detail tab |
| User payments | `adminUserPayments(userId, params)`: `["admin","user",userId,"payments",params]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminUserPayments(userId, params)` -> `GET /api/admin/users/{userId}/payments` | `Search`, `Sort`, `Fields`, `Expand`, `Page`, `PageSize`, `Provider`, `Status`, `PlanCode` | `ApiResponse<AdminPayment[]>` | `/users/:userId/payments` and user detail tab |
| Payments base invalidation | `adminPayments`: `["admin","payments"]` | `src/constants/queryKeys.ts` | Query key only in current source | none | n/a | `/payments` |
| Payments list | `adminPaymentsList(params)`: `["admin","payments",params]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminPayments(params)` -> `GET /api/admin/payments` | `page`, `pageSize`, `status`, `provider`, `planCode`, `search` are passed as-is | `ApiResponse<AdminPayment[]>` with optional pagination | `/payments` |
| Payment detail | `adminPaymentDetail(paymentTransactionId)`: `["admin","payment",paymentTransactionId]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminPaymentDetail(paymentTransactionId)` -> `GET /api/admin/payments/{paymentTransactionId}` | `paymentTransactionId` path param | `ApiResponse<AdminPayment>` | `/payments/:paymentTransactionId` |
| Subscription plans | `adminSubscriptionPlans`: `["admin","subscription-plans"]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getAdminSubscriptionPlans()` -> `GET /api/admin/subscription-plans` | none | `ApiResponse<AdminSubscriptionPlan[]>` | `/subscription-plans` |
| Update subscription plan | invalidates `adminSubscriptionPlans` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `updateAdminSubscriptionPlan(planCode, payload)` -> `PATCH /api/admin/subscription-plans/{planCode}` | path `planCode`; body `UpdateAdminSubscriptionPlanPayload` | `ApiResponse<AdminSubscriptionPlan>` | `/subscription-plans` edit modal |
| Care task generation schedule | `adminCareTaskGenerationSchedule`: `["admin","background-jobs","care-task-generation","schedule"]` | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `getCareTaskGenerationSchedule()` -> `GET /api/admin/background-jobs/care-task-generation/schedule` | none | `ApiResponse<CareTaskGenerationSchedule>` | `/background-jobs/care-task-generation` |
| Update care task generation schedule | same schedule key | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `updateCareTaskGenerationSchedule(dailyRunTime)` -> `PUT /api/admin/background-jobs/care-task-generation/schedule` | body `{ dailyRunTime }`; format should be `HH:mm:ss` | `ApiResponse<CareTaskGenerationSchedule>` | `/background-jobs/care-task-generation` |
| Update user role | invalidates admin users/dashboard/detail | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `updateAdminUserRole(userId, role)` -> `PUT /api/admin/users/{userId}/role` | body `{ role }` | `ApiResponse<AdminUser>` | `/users/:userId` action |
| Update user status | invalidates admin users/dashboard/detail | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `updateAdminUserStatus(userId, status)` -> `PUT /api/admin/users/{userId}/status` | body `{ status }` | `ApiResponse<AdminUser>` | `/users/:userId` action |
| Update user plan | invalidates admin users/dashboard/detail/subscriptions/payments | `src/hooks/useAdmin.ts`, `src/services/adminApi.ts` | `updateAdminUserPlan(userId, planCode)` -> `PUT /api/admin/users/{userId}/plan` | body `{ planCode }` | `ApiResponse<AdminUserSubscription>` | `/users/:userId` action |

Unknown / needs backend confirmation:

- Whether admin-only authorization is enforced server-side on every `/api/admin/*` endpoint.
- Whether refresh tokens can be exchanged for new access tokens. No refresh endpoint is visible in source.
- Whether auth can be moved to httpOnly cookie sessions for the web admin.
- Exact allowed enum values beyond those typed in source.
- Exact search semantics for users/payments.
- Whether sort syntax is ascending/descending by `field`, `-field`, `field:desc`, etc.

## 3. Recommended Admin Web Stack

- Vite + React + TypeScript.
- React Router for routes and protected route wrappers.
- TanStack Query for server state.
- Tailwind CSS.
- shadcn/ui or equivalent accessible component system.
- Recharts for charts if dashboard visualization is needed.
- Axios or fetch API client with `Authorization: Bearer <token>`.
- Use lucide-react icons.
- Use a small auth store, e.g. Zustand or React context.

## 4. Admin Routes

- `/login`: Admin login page. This must be the first visible page when opening `admin.plantcarehub.id.vn`.
- `/dashboard`: Protected dashboard overview.
- `/users`: Protected users list.
- `/users/:userId`: Protected user detail.
- `/users/:userId/subscriptions`: Protected user subscription history.
- `/users/:userId/payments`: Protected user payment history.
- `/payments`: Protected payments list.
- `/payments/:paymentTransactionId`: Protected payment detail.
- `/subscription-plans`: Protected subscription plan list and edit flow.
- `/background-jobs/care-task-generation`: Protected care task generation schedule.
- `/settings`: Protected admin account/settings page.
- `/*`: Not found route. If unauthenticated, redirect to `/login`; if authenticated, show a clean not-found page.

## 5. Page Requirements

### `/login`

- Purpose: authenticate admin users using existing backend auth.
- API/data needed: `POST /api/auth/login`, then use login `user` or call `GET /api/users/me`.
- Main UI sections: brand/logo, email field, password field, submit button, error alert.
- Search/filter/sort: none.
- Loading state: disable form and show spinner on submit.
- Empty state: n/a.
- Error state: invalid credentials, network/server unavailable, missing token, missing user.
- Allowed actions: login only.
- After login: if `user.role === "Admin"`, navigate to `/dashboard`; otherwise show Access Denied and allow logout.

### `/dashboard`

- Purpose: high-level system overview.
- API/data needed: `GET /api/admin/dashboard`.
- Main UI sections: KPI cards for users, payments, revenue, AI usage; charts for payments by status, users by plan, users by role; recent users/payments if returned.
- Search/filter/sort: optional date range only if backend supports it; currently unknown / needs backend confirmation.
- Loading state: skeleton cards/charts.
- Empty state: show zero values and "No dashboard data yet".
- Error state: retry card; 401 -> logout/redirect; 403 -> Access Denied.
- Allowed actions: refresh; navigate to related list pages.

### `/users`

- Purpose: browse and manage user accounts.
- API/data needed: `GET /api/admin/users`.
- Main UI sections: summary header, search input, horizontal filters, users table, pagination.
- Search/filter/sort: search by name/email; role filter; status filter; plan filter; sort if backend confirms syntax.
- Loading state: table skeleton rows.
- Empty state: "No users found" with clear filters.
- Error state: retry card.
- Allowed actions: refresh, clear filters, open user detail.

### `/users/:userId`

- Purpose: inspect and administer one user.
- API/data needed: `GET /api/admin/users/{userId}`, `GET /api/admin/users/{userId}/subscriptions`, `GET /api/admin/users/{userId}/payments`, `GET /api/admin/subscription-plans`.
- Main UI sections: identity header, role/status/plan badges, profile fields, recent subscriptions, recent payments, action area.
- Search/filter/sort: quick filter for plan selection in change-plan modal.
- Loading state: detail skeleton.
- Empty state: empty subscription/payment sections.
- Error state: retry card or missing user id state.
- Allowed actions: change role, lock/unlock account, change plan, open full subscriptions/payments pages.

### `/users/:userId/subscriptions`

- Purpose: full subscription history for one user.
- API/data needed: `GET /api/admin/users/{userId}/subscriptions`.
- Main UI sections: table/list with plan, status, start/end dates, usage fields if available.
- Search/filter/sort: search, sort, pagination if backend supports.
- Loading state: table skeleton.
- Empty state: "No subscription history".
- Error state: retry card.
- Allowed actions: refresh, open user detail.

### `/users/:userId/payments`

- Purpose: full payment history for one user.
- API/data needed: `GET /api/admin/users/{userId}/payments`.
- Main UI sections: table with transaction id/order code, status, provider, plan, amount, created/paid dates.
- Search/filter/sort: search, status, provider, plan, pagination.
- Loading state: table skeleton.
- Empty state: "No payments for this user".
- Error state: retry card.
- Allowed actions: refresh, open payment detail.

### `/payments`

- Purpose: browse payment transactions.
- API/data needed: `GET /api/admin/payments`.
- Main UI sections: search, horizontal dropdown filters, payments table, pagination.
- Search/filter/sort: search by transaction/order/email; status; provider; plan; sort unknown / needs backend confirmation.
- Loading state: table skeleton.
- Empty state: "No payments found" with clear filters.
- Error state: retry card.
- Allowed actions: refresh, clear filters, open payment detail.

### `/payments/:paymentTransactionId`

- Purpose: inspect one payment.
- API/data needed: `GET /api/admin/payments/{paymentTransactionId}`.
- Main UI sections: payment status header, amount, user email, plan, provider, checkout URL, timestamps, raw message, metadata.
- Search/filter/sort: none.
- Loading state: detail skeleton.
- Empty state: n/a.
- Error state: retry card or missing id state.
- Allowed actions: refresh, copy identifiers/URL, open related user if `userId` is available.

### `/subscription-plans`

- Purpose: manage subscription plans.
- API/data needed: `GET /api/admin/subscription-plans`, `PATCH /api/admin/subscription-plans/{planCode}`.
- Main UI sections: plan cards/table, status, price, limits, AI quota, ads flag, edit modal/drawer.
- Search/filter/sort: optional local search by plan code/name.
- Loading state: plan skeletons.
- Empty state: "No subscription plans".
- Error state: retry card.
- Allowed actions: edit name, description, price, currency, billing cycle, max plants, AI quota limit/period, show ads, active state.

### `/background-jobs/care-task-generation`

- Purpose: view and update daily care task generation schedule.
- API/data needed: `GET /api/admin/background-jobs/care-task-generation/schedule`, `PUT /api/admin/background-jobs/care-task-generation/schedule`.
- Main UI sections: job name, current daily run time, time zone, next run time, update form.
- Search/filter/sort: none.
- Loading state: schedule skeleton.
- Empty state: show "unknown / needs backend confirmation" for missing fields.
- Error state: retry card. For `400`, show invalid time format.
- Allowed actions: update `dailyRunTime`; validate `HH:mm` in UI and send `HH:mm:ss`.

### `/settings`

- Purpose: admin profile/session settings.
- API/data needed: current user from auth store or `GET /api/users/me`; schedule page should be separate even though current mobile settings includes it.
- Main UI sections: admin identity, role badge, session controls, app environment display.
- Search/filter/sort: none.
- Loading state: session restore state.
- Empty state: n/a.
- Error state: if session invalid, redirect to `/login`.
- Allowed actions: logout.

### Access Denied

- Purpose: block authenticated non-admin users.
- API/data needed: current user role from login response or `GET /api/users/me`.
- Main UI sections: title, explanation, signed-in email/role, logout button.
- Allowed actions: logout and return to `/login`.

## 6. UI/UX Direction

Use a clean premium SaaS dashboard style:

- Light theme only. Do not use a dark/black background.
- Desktop-first shell with left sidebar and protected content area.
- Topbar with global search placeholder, notification icon, and admin profile menu.
- Rounded cards, subtle borders, soft shadows, and dense data tables.
- Horizontal filters. Each filter opens its own dropdown; do not show all filters expanded at once.
- Use drawers/modals for quick detail or edit flows when suitable.
- Responsive layout should still work on tablet/mobile, but optimize desktop first.
- PlantCare Hub visual identity:
  - forest green: use source references like `hsl(128 30% 12%)`, `hsl(126 34% 21%)`, `hsl(124 33% 25%)`
  - sage: `hsl(100 10% 91%)`, `hsl(100 12% 84%)`
  - mint: `hsl(160 40% 90%)`
  - warm off-white: `hsl(60 14% 95%)`
  - white cards: `#FFFFFF`
  - soft shadow color can be based on `#17301F`
- Existing app uses Be Vietnam Pro fonts. For admin web use Inter by default, or Nunito/Quicksand if choosing a softer brand feel. If matching mobile more closely, use Be Vietnam Pro.

## 7. Auth & Permission Requirements

- Login should use `POST /api/auth/login` with `{ email, password }`.
- Extract token from `accessToken`, `token`, `jwt`, or `access_token`.
- Extract refresh token from `refreshToken` or `refresh_token` if present.
- If login response has no user, call `GET /api/users/me`.
- Store token safely for web. Preferred: in-memory access token plus backend-supported httpOnly refresh/session cookie. If backend does not support cookies, use localStorage/sessionStorage with explicit XSS risk acknowledgement and keep the app hardened.
- API client must attach `Authorization: Bearer <token>` to all protected API calls except auth endpoints.
- Restore session before rendering protected pages.
- If no token: redirect to `/login`.
- If token exists but current user is not admin: show Access Denied and allow logout.
- If API returns 401: clear session and redirect to `/login`.
- If API returns 403: show Access Denied and allow logout.
- Logout clears all session state and returns to `/login`.

## 8. Data Models

These are extracted from source unless marked inferred.

```ts
type AdminUserRole = "Admin" | "Personal" | "Garden" | string;
type AdminUserStatus = "Active" | "Locked" | string;
type PlanCode = "Free" | "Plus" | "Pro" | "Garden" | string;

interface AdminDashboard {
  totalUsers?: number | { key?: string; count?: number | string };
  activeUsers?: number | { key?: string; count?: number | string };
  lockedUsers?: number | { key?: string; count?: number | string };
  totalPayments?: number | { key?: string; count?: number | string };
  paidPayments?: number | { key?: string; count?: number | string };
  pendingPayments?: number | { key?: string; count?: number | string };
  failedPayments?: number | { key?: string; count?: number | string };
  expiredPayments?: number | { key?: string; count?: number | string };
  totalRevenue?: number | { key?: string; count?: number | string };
  paidRevenueTotal?: number | { key?: string; count?: number | string };
  paidRevenueToday?: number | { key?: string; count?: number | string };
  paidRevenueThisMonth?: number | { key?: string; count?: number | string };
  aiUsageToday?: number | { key?: string; count?: number | string };
  aiUsageThisMonth?: number | { key?: string; count?: number | string };
  usersByRole?: Record<string, number> | Array<{ key?: string; count?: number | string }>;
  usersByPlan?: Record<string, number> | Array<{ key?: string; count?: number | string }>;
  paymentsByStatus?: Record<string, number> | Array<{ key?: string; count?: number | string }>;
  recentUsers?: AdminUser[];
  recentPayments?: PaymentTransaction[];
}

interface AdminUser {
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
  currentPlan?: {
    code: PlanCode;
    name?: string;
  };
  phone?: string;
  address?: string;
  plantCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

type AdminUserDetail = AdminUser;

interface UserSubscription {
  userSubscriptionId?: number | string;
  userId?: number | string;
  id?: number | string;
  _id?: number | string;
  planCode?: PlanCode;
  status?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  plan?: {
    code?: PlanCode;
    name?: string;
  };
  plantUsage?: {
    used?: number;
    limit?: number;
    remaining?: number;
  };
  aiUsage?: {
    used?: number;
    limit?: number;
    remaining?: number;
  };
}

interface PaymentTransaction {
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
}

interface SubscriptionPlan {
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
}

interface CareTaskGenerationSchedule {
  jobName: string;
  dailyRunTime: string;
  timeZone: string;
  nextRunAt: string;
}
```

Inferred fields:

- `AdminUserDetail` is inferred to be the same shape as `AdminUser` because source uses `ApiResponse<AdminUser>` for detail.
- `PaymentTransaction` is the admin web name for source type `AdminPayment`.
- `UserSubscription` is the admin web name for source type `AdminUserSubscription`.
- `SubscriptionStatus` and `PaymentStatus` exact enum values are imported from other files in source; safe UI values observed include `Active`, `Pending`, `Cancelled/Canceled`, `Expired`, `Paid`, `Failed`.

## 9. Suggested Folder Structure

```txt
admin-web/
  src/
    app/
      App.tsx
      router.tsx
      providers.tsx
    routes/
      ProtectedRoute.tsx
      PublicOnlyRoute.tsx
      AccessDenied.tsx
      NotFound.tsx
    pages/
      LoginPage.tsx
      DashboardPage.tsx
      UsersPage.tsx
      UserDetailPage.tsx
      UserSubscriptionsPage.tsx
      UserPaymentsPage.tsx
      PaymentsPage.tsx
      PaymentDetailPage.tsx
      SubscriptionPlansPage.tsx
      CareTaskGenerationPage.tsx
      SettingsPage.tsx
    components/
      layout/
      ui/
      data-table/
      filters/
    features/
      auth/
      dashboard/
      users/
      payments/
      subscription-plans/
      background-jobs/
    hooks/
    lib/
      apiClient.ts
      queryKeys.ts
      authStorage.ts
      format.ts
    types/
      api.ts
      auth.ts
      admin.ts
      user.ts
    styles/
      globals.css
```

## 10. Environment Variables

Required:

```env
VITE_API_BASE_URL=https://api.plantcarehub.id.vn
VITE_ADMIN_APP_NAME=PlantCare Hub Admin
```

Rules:

- Do not hardcode the API URL in source.
- Normalize `VITE_API_BASE_URL` to remove trailing slash.
- Use separate `.env.production` for deployed admin web if needed.

## 11. Deployment Notes

- Build as a static web app.
- Deploy to Vercel, Netlify, Cloudflare Pages, or similar static hosting.
- Point DNS `admin.plantcarehub.id.vn` to the hosting provider.
- Backend CORS must allow `https://admin.plantcarehub.id.vn`.
- Backend must allow `Authorization` header and required methods: `GET`, `POST`, `PUT`, `PATCH`, `OPTIONS`.
- Do not hardcode API URL.
- Ensure the hosting provider rewrites all SPA routes to `index.html`.
- Keep the existing mobile app unaffected.

## 12. Acceptance Criteria

- Visiting `admin.plantcarehub.id.vn` shows the Admin Login page.
- Admin login works using the existing backend auth.
- Non-admin users are blocked by an Access Denied screen and can logout.
- Protected pages restore session before rendering.
- Dashboard loads real data or clear empty states.
- Users list works with search, filters, pagination, loading, empty, and error states.
- User detail works and supports role/status/plan actions based on existing endpoints.
- User subscription and payment history pages work.
- Payments list/detail works.
- Subscription plans page works and supports existing update endpoint.
- Care task generation schedule page works and validates `HH:mm` before sending `HH:mm:ss`.
- UI is clean, light, responsive, desktop-first, and has no overlapping items.
- Existing mobile app is not affected.

## 13. Final Antigravity Prompt

```txt
Build a separate desktop-first PlantCare Hub Admin Web app based on ADMIN_WEB_HANDOFF.md.

Rules:
-Create this as a standalone project in the current folder.
- Do not modify or refactor the existing Expo mobile app.
- Use Vite + React + TypeScript, React Router, TanStack Query, Tailwind CSS, shadcn/ui or equivalent, lucide-react, and Recharts where useful.
- Use Axios or fetch with an API client that reads VITE_API_BASE_URL and attaches Authorization: Bearer <token>.
- Do not hardcode the API URL.
- Mark any unclear backend behavior as unknown / needs backend confirmation rather than inventing endpoints.

Required behavior:
- Domain target is admin.plantcarehub.id.vn.
- The first page users see is /login.
- Login uses POST /api/auth/login with email/password.
- Extract access token from accessToken, token, jwt, or access_token.
- If login response has no user, call GET /api/users/me.
- Admin access is user.role === "Admin".
- If no token, redirect protected routes to /login.
- If token exists but user is not admin, show Access Denied with logout.
- Logout clears session and returns to /login.

Required routes:
- /login
- /dashboard
- /users
- /users/:userId
- /users/:userId/subscriptions
- /users/:userId/payments
- /payments
- /payments/:paymentTransactionId
- /subscription-plans
- /background-jobs/care-task-generation
- /settings
- /*

Use the API inventory, data models, page requirements, UI/UX direction, environment variables, deployment notes, and acceptance criteria from ADMIN_WEB_HANDOFF.md as the source of truth. Build a clean premium light SaaS dashboard with left sidebar, topbar, cards, tables, horizontal dropdown filters, modals/drawers where suitable, and PlantCare Hub forest green/sage/mint/off-white identity.
```
