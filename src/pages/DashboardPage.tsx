import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowUpRight, CreditCard, RefreshCw, Sprout, Users, Wallet } from "lucide-react";
import { getAdminDashboard } from "../features/admin/adminApi";
import { queryKeys } from "../lib/queryKeys";
import { asCount, chartRows, formatMoney, userIdOf } from "../lib/format";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ErrorState, LoadingRows } from "../components/ui/State";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export function DashboardPage() {
  const query = useQuery({ queryKey: queryKeys.dashboard, queryFn: getAdminDashboard });
  if (query.isLoading) return <DashboardLoading />;
  if (query.isError) return <ErrorState message="Dashboard data is unavailable." onRetry={() => query.refetch()} />;
  const data = query.data;
  const stats = [
    { label: "Total users", value: asCount(data?.totalUsers), icon: Users, detail: `${asCount(data?.activeUsers)} active`, tone: "mint" },
    { label: "Paid payments", value: asCount(data?.paidPayments), icon: CreditCard, detail: `${asCount(data?.pendingPayments)} pending`, tone: "sage" },
    { label: "Revenue", value: formatMoney(asCount(data?.paidRevenueTotal)), icon: Wallet, detail: `${formatMoney(asCount(data?.paidRevenueToday))} today`, tone: "forest" },
    { label: "AI usage today", value: asCount(data?.aiUsageToday), icon: Activity, detail: `${asCount(data?.aiUsageThisMonth)} this month`, tone: "leaf" }
  ];
  return (
    <div className="space-y-7">
      <PageTitle title="Dashboard" description="System health, revenue, and recent admin activity." eyebrow="Admin overview" elevated>
        <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </PageTitle>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.25fr_1fr_1fr]">
        <ChartCard title="Payments by status" description="Transaction state distribution" rows={chartRows(data?.paymentsByStatus)} />
        <ChartCard title="Users by plan" description="Current plan mix" rows={chartRows(data?.usersByPlan)} />
        <ChartCard title="Users by role" description="Permission profile" rows={chartRows(data?.usersByRole)} />
      </section>
      <div className="grid gap-5 xl:grid-cols-2">
        <ActivityCard title="Recent users" viewAll="/users">
          {data?.recentUsers?.length ? (
            <div className="space-y-2">
              {data.recentUsers.map((u) => (
                <Link className="group flex items-center justify-between rounded-2xl border border-transparent px-3 py-3 text-sm transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:border-sage-200 hover:bg-sage-100/55" key={userIdOf(u)} to={`/users/${userIdOf(u)}`}>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-forest-950">{u.fullName || u.email}</span>
                    <span className="block truncate text-xs text-forest-900/55">{u.email}</span>
                  </span>
                  <span className="rounded-xl bg-white px-2.5 py-1 text-xs font-semibold text-forest-900/62 shadow-card">{u.role}</span>
                </Link>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No recent users" description="New user activity will appear here when the API returns recent accounts." />
          )}
        </ActivityCard>
        <ActivityCard title="Recent payments" viewAll="/payments">
          {data?.recentPayments?.length ? (
            <div className="space-y-2">
              {data.recentPayments.map((p) => (
                <Link className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent px-3 py-3 text-sm transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:border-sage-200 hover:bg-sage-100/55" key={p.paymentTransactionId} to={`/payments/${p.paymentTransactionId}`}>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-forest-950">{p.userEmail || p.orderCode || p.paymentTransactionId}</span>
                    <span className="block truncate text-xs text-forest-900/55">{p.provider} - {p.status}</span>
                  </span>
                  <span className="tabular text-sm font-semibold text-forest-950">{formatMoney(p.amount, p.currency)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <DashboardEmptyState title="No recent payments" description="Payment activity will appear here after successful backend transactions." />
          )}
        </ActivityCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, detail, tone }: { label: string; value: string | number; icon: LucideIcon; detail: string; tone: string }) {
  const toneClass = {
    mint: "from-mint to-white",
    sage: "from-sage-100 to-white",
    forest: "from-forest-900/10 to-white",
    leaf: "from-emerald-50 to-white"
  }[tone] || "from-sage-100 to-white";

  return (
    <Card className="group overflow-hidden p-1.5 transition duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-elevated">
      <div className={`relative h-full rounded-[1.05rem] bg-gradient-to-br ${toneClass} p-5`}>
        <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-white/50 blur-xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-forest-900/58">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] tabular text-forest-950">{value}</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-forest-900 shadow-card ring-1 ring-forest-900/[0.05]">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-forest-900/55">
          <ArrowUpRight className="h-3.5 w-3.5 text-forest-800" strokeWidth={1.8} />
          {detail}
        </div>
      </div>
    </Card>
  );
}

function ChartCard({ title, description, rows }: { title: string; description: string; rows: { name: string; value: number }[] }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return (
    <Card className="overflow-hidden p-1.5">
      <div className="rounded-[1.05rem] bg-white">
        <CardHeader className="flex items-start justify-between gap-4 border-b-0 pb-3">
          <div>
            <h2 className="font-semibold tracking-[-0.01em] text-forest-950">{title}</h2>
            <p className="mt-1 text-xs font-medium text-forest-900/52">{description}</p>
          </div>
          <span className="rounded-xl bg-sage-100 px-2.5 py-1 text-xs font-semibold tabular text-forest-900/64">{total}</span>
        </CardHeader>
        <CardContent className="pt-0">
          {rows.length ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows} margin={{ top: 12, right: 4, left: -26, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#e4e8df" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#60705f", fontSize: 11 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#60705f", fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "rgba(216, 225, 209, .35)" }} contentStyle={{ borderRadius: 14, border: "1px solid #d9ded2", boxShadow: "0 18px 42px -30px rgba(23,48,31,.42)" }} />
                    <Bar dataKey="value" fill="#2a5533" radius={[10, 10, 4, 4]} maxBarSize={54} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {rows.map((row) => (
                  <span key={row.name} className="inline-flex items-center gap-2 rounded-xl bg-sage-100/80 px-2.5 py-1 text-xs font-semibold text-forest-900/64">
                    <span className="h-2 w-2 rounded-full bg-forest-800" />
                    {row.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <DashboardEmptyState title="No chart data yet" description="This chart will populate as soon as the dashboard endpoint returns grouped metrics." />
          )}
        </CardContent>
      </div>
    </Card>
  );
}

function ActivityCard({ title, viewAll, children }: { title: string; viewAll: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden p-1.5">
      <div className="rounded-[1.05rem] bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-2">
          <div>
            <h2 className="font-semibold tracking-[-0.01em] text-forest-950">{title}</h2>
            <p className="mt-1 text-xs font-medium text-forest-900/52">Latest records returned by the admin API</p>
          </div>
          <Link className="rounded-xl bg-sage-100 px-3 py-1.5 text-xs font-semibold text-forest-900/70 transition hover:bg-mint hover:text-forest-950" to={viewAll}>View all</Link>
        </CardHeader>
        <CardContent className="pt-2">{children}</CardContent>
      </div>
    </Card>
  );
}

function DashboardEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-[1.05rem] border border-dashed border-sage-200 bg-gradient-to-br from-sage-100/80 to-white p-6 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest-900 shadow-card">
          <Sprout className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-forest-950">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-forest-900/58">{description}</p>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-7">
      <div className="h-32 animate-pulse rounded-[1.65rem] bg-white/70" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-[1.35rem] bg-white/70" />)}
      </div>
      <LoadingRows rows={6} />
    </div>
  );
}

export function PageTitle({ title, description, children, eyebrow, elevated }: { title: string; description?: string; children?: React.ReactNode; eyebrow?: string; elevated?: boolean }) {
  return (
    <div className={elevated ? "flex flex-col gap-4 rounded-[1.65rem] border border-white/70 bg-white/58 p-5 shadow-card ring-1 ring-forest-900/[0.03] sm:flex-row sm:items-end sm:justify-between" : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"}>
      <div>
        {eyebrow ? <p className="mb-2 inline-flex rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">{eyebrow}</p> : null}
        <h1 className={elevated ? "text-4xl font-semibold tracking-[-0.04em] text-forest-950" : "text-3xl font-semibold tracking-tight text-forest-950"}>{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-forest-900/62">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}
