import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowUpRight, RefreshCw, UsersRound } from "lucide-react";
import { getAdminUsers } from "../features/admin/adminApi";
import { queryKeys } from "../lib/queryKeys";
import { formatDate, userIdOf } from "../lib/format";
import { PageTitle } from "./DashboardPage";
import { Button } from "../components/ui/Button";
import { PlanBadge, RoleBadge, StatusBadge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/State";
import { DataTable } from "../components/data/DataTable";
import { FilterSelect, SearchFilters } from "../components/data/Filters";
import { Pagination } from "../components/data/Pagination";
import type { AdminUser } from "../types/admin";

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [pageSize, setPageSize] = useState("15");
  const params = { page, pageSize: Number(pageSize), search, role, status, planCode };
  const query = useQuery({ queryKey: queryKeys.users(params), queryFn: () => getAdminUsers(params) });
  const columns = useMemo(() => userColumns, []);
  const total = query.data?.pagination?.totalItems;
  const visible = query.data?.data?.length ?? 0;
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
                <UsersRound className="h-3.5 w-3.5" strokeWidth={1.8} />
                User administration
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-forest-950">Users</h1>
              <p className="mt-2 text-sm leading-6 text-forest-900/62">Browse accounts, inspect profile health, and open admin actions with clear role, status, and plan context.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-forest-900/[0.04]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-900/42">Total users</p>
                <p className="mt-1 text-2xl font-semibold tabular tracking-[-0.03em] text-forest-950">{total ?? visible}</p>
              </div>
              <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </div>
        </div>
      </section>
      <SearchFilters search={search} resultLabel={`${visible} shown`} onSearch={(v) => { setSearch(v); setPage(1); }} onClear={() => { setSearch(""); setRole(""); setStatus(""); setPlanCode(""); setPageSize("15"); setPage(1); }}>
        <FilterSelect label="Role" value={role} onChange={setRole} options={["Admin", "Personal", "Garden"]} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={["Active", "Locked"]} />
        <FilterSelect label="Plan" value={planCode} onChange={setPlanCode} options={["Free", "Plus", "Pro", "Garden"]} />
        <FilterSelect label="Page size" value={pageSize} onChange={(value) => { setPageSize(value || "15"); setPage(1); }} options={["10", "15", "25", "50"]} />
      </SearchFilters>
      {query.isError ? <ErrorState message="Users could not be loaded." onRetry={() => query.refetch()} /> : <Card className="overflow-hidden p-1.5"><div className="rounded-[1.05rem] bg-white"><DataTable columns={columns} rows={query.data?.data} loading={query.isLoading} emptyTitle="No users found" emptyDescription="No accounts match the current search and filters." emptyAction={<Button variant="secondary" onClick={() => { setSearch(""); setRole(""); setStatus(""); setPlanCode(""); setPage(1); }}>Clear filters</Button>} /><Pagination pagination={query.data?.pagination} page={page} setPage={setPage} /></div></Card>}
    </div>
  );
}

const userColumns = [
  { key: "user", header: "User", render: (u: AdminUser) => <Link className="group/user flex min-w-0 items-center gap-3" to={`/users/${userIdOf(u)}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-forest-900 text-sm font-bold text-white shadow-card">{(u.fullName || u.name || u.email || "U").slice(0, 1).toUpperCase()}</span><span className="min-w-0"><span className="block truncate font-semibold text-forest-950 group-hover/user:underline">{u.fullName || u.name || u.email}</span><span className="block truncate text-xs font-normal text-forest-900/55">{u.email}</span></span></Link> },
  { key: "role", header: "Role", render: (u: AdminUser) => <RoleBadge role={u.role} /> },
  { key: "status", header: "Status", render: (u: AdminUser) => <StatusBadge status={u.status} /> },
  { key: "plan", header: "Plan", render: (u: AdminUser) => <PlanBadge plan={u.currentPlan?.name || u.currentPlan?.code || u.planCode} /> },
  { key: "plants", header: "Plants", render: (u: AdminUser) => <span className="rounded-xl bg-sage-100 px-2.5 py-1 text-xs font-semibold tabular text-forest-900/70">{u.plantCount ?? 0}</span> },
  { key: "created", header: "Created", render: (u: AdminUser) => <span className="text-sm text-forest-900/62">{formatDate(u.createdAt)}</span> },
  { key: "action", header: "", className: "text-right", render: (u: AdminUser) => <Button asChild variant="secondary" className="h-9 rounded-xl px-3"><Link to={`/users/${userIdOf(u)}`}>Open <ArrowUpRight className="h-3.5 w-3.5" /></Link></Button> }
];
