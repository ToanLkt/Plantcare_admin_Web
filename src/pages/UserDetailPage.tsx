import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CreditCard, History, Mail, MapPin, Phone, RefreshCw, Settings2, Sprout, UserRound, type LucideIcon } from "lucide-react";
import { getAdminSubscriptionPlans, getAdminUserDetail, getAdminUserPayments, getAdminUserSubscriptions, updateAdminUserPlan, updateAdminUserRole, updateAdminUserStatus } from "../features/admin/adminApi";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../lib/queryKeys";
import { formatDate, userIdOf } from "../lib/format";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Badge, PlanBadge, RoleBadge, StatusBadge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { EmptyState, ErrorState, LoadingRows } from "../components/ui/State";
import { paymentColumns } from "./PaymentsPage";
import { DataTable } from "../components/data/DataTable";
import type { UserSubscription } from "../types/admin";

export function UserDetailPage() {
  const { userId = "" } = useParams();
  const userQuery = useQuery({ queryKey: queryKeys.user(userId), queryFn: () => getAdminUserDetail(userId), enabled: !!userId });
  const plansQuery = useQuery({ queryKey: queryKeys.plans, queryFn: getAdminSubscriptionPlans });
  const subsQuery = useQuery({ queryKey: queryKeys.userSubscriptions(userId, { page: 1, pageSize: 5 }), queryFn: () => getAdminUserSubscriptions(userId, { page: 1, pageSize: 5 }), enabled: !!userId });
  const paymentsQuery = useQuery({ queryKey: queryKeys.userPayments(userId, { page: 1, pageSize: 5 }), queryFn: () => getAdminUserPayments(userId, { page: 1, pageSize: 5 }), enabled: !!userId });
  const invalidate = () => { queryClient.invalidateQueries({ queryKey: ["admin"] }); };
  const roleMutation = useMutation({ mutationFn: (role: string) => updateAdminUserRole(userId, role), onSuccess: invalidate });
  const statusMutation = useMutation({ mutationFn: (status: string) => updateAdminUserStatus(userId, status), onSuccess: invalidate });
  const planMutation = useMutation({ mutationFn: (planCode: string) => updateAdminUserPlan(userId, planCode), onSuccess: invalidate });
  if (!userId) return <ErrorState message="Missing user id." />;
  if (userQuery.isLoading) return <LoadingRows rows={8} />;
  if (userQuery.isError) return <ErrorState message="User detail could not be loaded." onRetry={() => userQuery.refetch()} />;
  const user = userQuery.data;
  if (!user) return <ErrorState message="User detail was empty." onRetry={() => userQuery.refetch()} />;
  const displayName = user.fullName || user.name || user.email;
  const planName = user.currentPlan?.name || user.currentPlan?.code || user.planCode;
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[1.35rem] bg-forest-900 text-2xl font-bold text-white shadow-elevated">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <Button asChild variant="ghost" className="mb-2 h-8 px-2 text-forest-900/62">
                  <Link to="/users"><ArrowLeft className="h-4 w-4" /> Back to users</Link>
                </Button>
                <h1 className="truncate text-4xl font-semibold tracking-[-0.04em] text-forest-950">{displayName}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-forest-900/62"><Mail className="h-4 w-4" strokeWidth={1.8} /> {user.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                  <PlanBadge plan={planName} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary"><Link to={`/users/${userId}/subscriptions`}><History className="h-4 w-4" /> Subscriptions</Link></Button>
              <Button asChild variant="secondary"><Link to={`/users/${userId}/payments`}><CreditCard className="h-4 w-4" /> Payments</Link></Button>
              <Button variant="secondary" onClick={() => userQuery.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </div>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1fr_25rem]">
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-white">
            <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Account profile</h2></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <Info icon={UserRound} label="User ID" value={userIdOf(user)} />
              <Info icon={Phone} label="Phone" value={user.phone || "Unknown"} />
              <Info icon={MapPin} label="Address" value={user.address || "Unknown"} />
              <Info icon={Sprout} label="Plants" value={String(user.plantCount ?? 0)} />
              <Info icon={History} label="Created" value={formatDate(user.createdAt)} />
              <Info icon={RefreshCw} label="Updated" value={formatDate(user.updatedAt)} />
            </CardContent>
          </div>
        </Card>
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-gradient-to-br from-white to-sage-100/50">
            <CardHeader className="border-b-0 pb-2">
              <h2 className="flex items-center gap-2 font-semibold"><Settings2 className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Admin actions</h2>
              <p className="mt-1 text-xs leading-5 text-forest-900/55">Changes are applied immediately through the existing admin endpoints.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActionSelect label="Role" loading={roleMutation.isPending} value={user.role} onChange={(value) => roleMutation.mutate(value)}>
                <option>Admin</option><option>Personal</option><option>Garden</option>
              </ActionSelect>
              <ActionSelect label="Status" loading={statusMutation.isPending} value={user.status} onChange={(value) => statusMutation.mutate(value)}>
                <option>Active</option><option>Locked</option>
              </ActionSelect>
              <ActionSelect label="Plan" loading={planMutation.isPending || plansQuery.isLoading} value={user.currentPlan?.code || user.planCode || ""} onChange={(value) => value && planMutation.mutate(value)}>
                <option value="">Change plan</option>{plansQuery.data?.map((p) => <option key={p.code} value={p.code}>{p.name || p.code}</option>)}
              </ActionSelect>
            </CardContent>
          </div>
        </Card>
      </div>
      <HistorySection title="Recent subscriptions" icon={History} to={`/users/${userId}/subscriptions`}>
        <DataTable columns={subscriptionColumns} rows={subsQuery.data?.data} loading={subsQuery.isLoading} emptyTitle="No subscription history" emptyDescription="This user does not have subscription records yet." />
      </HistorySection>
      <HistorySection title="Recent payments" icon={CreditCard} to={`/users/${userId}/payments`}>
        {paymentsQuery.data?.data?.length || paymentsQuery.isLoading ? <DataTable columns={paymentColumns} rows={paymentsQuery.data?.data} loading={paymentsQuery.isLoading} emptyTitle="No payments for this user" emptyDescription="Payment history will appear after this user starts checkout." /> : <EmptyState title="No payments for this user" description="Payment history will appear after this user starts checkout." />}
      </HistorySection>
    </div>
  );
}

export const subscriptionColumns = [
  { key: "plan", header: "Plan", render: (s: UserSubscription) => <PlanBadge plan={s.plan?.name || s.plan?.code || s.planCode} /> },
  { key: "status", header: "Status", render: (s: UserSubscription) => <Badge tone={s.status === "Active" ? "success" : "neutral"}>{s.status || "Unknown"}</Badge> },
  { key: "start", header: "Start", render: (s: UserSubscription) => <span className="text-forest-900/62">{formatDate(s.startDate || s.createdAt)}</span> },
  { key: "end", header: "End", render: (s: UserSubscription) => <span className="text-forest-900/62">{formatDate(s.endDate)}</span> },
  { key: "plants", header: "Plant usage", render: (s: UserSubscription) => <span className="rounded-xl bg-sage-100 px-2.5 py-1 text-xs font-semibold tabular text-forest-900/70">{s.plantUsage?.used ?? 0}/{s.plantUsage?.limit ?? "unknown"}</span> },
  { key: "ai", header: "AI usage", render: (s: UserSubscription) => <span className="rounded-xl bg-mint px-2.5 py-1 text-xs font-semibold tabular text-forest-900/80">{s.aiUsage?.used ?? 0}/{s.aiUsage?.limit ?? "unknown"}</span> }
];

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-2xl bg-sage-100/70 p-4 ring-1 ring-forest-900/[0.03]"><div className="flex items-center gap-2 text-xs font-semibold text-forest-900/48"><Icon className="h-3.5 w-3.5" strokeWidth={1.8} />{label}</div><p className="mt-2 break-words text-sm font-semibold text-forest-950">{value}</p></div>;
}

function ActionSelect({ label, value, loading, onChange, children }: { label: string; value: string; loading?: boolean; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-forest-900/55">{label}</span>
      <Select className="h-11 w-full rounded-2xl bg-white shadow-card" value={value} disabled={loading} onChange={(e) => onChange(e.target.value)}>
        {children}
      </Select>
    </label>
  );
}

function HistorySection({ title, icon: Icon, to, children }: { title: string; icon: LucideIcon; to: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden p-1.5">
      <div className="rounded-[1.05rem] bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-2">
          <h2 className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> {title}</h2>
          <Link className="rounded-xl bg-sage-100 px-3 py-1.5 text-xs font-semibold text-forest-900/70 transition hover:bg-mint hover:text-forest-950" to={to}>View all</Link>
        </CardHeader>
        <CardContent className="pt-2">{children}</CardContent>
      </div>
    </Card>
  );
}
