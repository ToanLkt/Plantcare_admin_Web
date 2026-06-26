import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, History, RefreshCw } from "lucide-react";
import { getAdminUserSubscriptions } from "../features/admin/adminApi";
import { queryKeys } from "../lib/queryKeys";
import { subscriptionColumns } from "./UserDetailPage";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/data/DataTable";
import { Pagination } from "../components/data/Pagination";
import { ErrorState } from "../components/ui/State";

export function UserSubscriptionsPage() {
  const { userId = "" } = useParams();
  const [page, setPage] = useState(1);
  const query = useQuery({ queryKey: queryKeys.userSubscriptions(userId, { page, pageSize: 15 }), queryFn: () => getAdminUserSubscriptions(userId, { page, pageSize: 15 }) });
  const total = query.data?.pagination?.totalItems;
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Button asChild variant="ghost" className="mb-2 h-8 px-2 text-forest-900/62"><Link to={`/users/${userId}`}><ArrowLeft className="h-4 w-4" /> Back to user</Link></Button>
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900"><History className="h-3.5 w-3.5" strokeWidth={1.8} /> Subscription history</p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-forest-950">User subscriptions</h1>
              <p className="mt-2 text-sm leading-6 text-forest-900/62">Full subscription timeline for user {userId}.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-forest-900/[0.04]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-900/42">Records</p>
                <p className="mt-1 text-2xl font-semibold tabular tracking-[-0.03em] text-forest-950">{total ?? query.data?.data?.length ?? 0}</p>
              </div>
              <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </div>
        </div>
      </section>
      {query.isError ? <ErrorState message="Subscription history could not be loaded." onRetry={() => query.refetch()} /> : <Card className="overflow-hidden p-1.5"><div className="rounded-[1.05rem] bg-white"><DataTable columns={subscriptionColumns} rows={query.data?.data} loading={query.isLoading} emptyTitle="No subscription history" emptyDescription="This user does not have subscription records yet." /><Pagination pagination={query.data?.pagination} page={page} setPage={setPage} /></div></Card>}
    </div>
  );
}
