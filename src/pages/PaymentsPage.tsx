import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowUpRight, CreditCard, RefreshCw } from "lucide-react";
import { getAdminPayments } from "../features/admin/adminApi";
import { queryKeys } from "../lib/queryKeys";
import { formatDate, formatMoney } from "../lib/format";
import { Button } from "../components/ui/Button";
import { PaymentStatusBadge, PlanBadge, ProviderBadge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/State";
import { DataTable } from "../components/data/DataTable";
import { FilterSelect, SearchFilters } from "../components/data/Filters";
import { Pagination } from "../components/data/Pagination";
import type { PaymentTransaction } from "../types/admin";

export function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [planCode, setPlanCode] = useState("");
  const [pageSize, setPageSize] = useState("15");
  const params = { page, pageSize: Number(pageSize), search, status, provider, planCode };
  const query = useQuery({ queryKey: queryKeys.payments(params), queryFn: () => getAdminPayments(params) });
  const total = query.data?.pagination?.totalItems;
  const visible = query.data?.data?.length ?? 0;
  return (
    <div className="min-w-0 space-y-6">
      <section className="min-w-0 overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
                <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} />
                Payment operations
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-forest-950">Payments</h1>
              <p className="mt-2 text-sm leading-6 text-forest-900/62">Review provider transactions, reconcile status, and open payment details with clear order and user context.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-forest-900/[0.04]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-900/42">Total payments</p>
                <p className="mt-1 text-2xl font-semibold tabular tracking-[-0.03em] text-forest-950">{total ?? visible}</p>
              </div>
              <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </div>
        </div>
      </section>
      <SearchFilters placeholder="Search transaction, order, or email" search={search} resultLabel={`${visible} shown`} onSearch={(v) => { setSearch(v); setPage(1); }} onClear={() => { setSearch(""); setStatus(""); setProvider(""); setPlanCode(""); setPageSize("15"); setPage(1); }}>
        <FilterSelect label="Status" value={status} onChange={setStatus} options={["Paid", "Pending", "Failed", "Expired"]} />
        <FilterSelect label="Provider" value={provider} onChange={setProvider} options={["PayOS", "Stripe", "Momo", "VNPAY"]} />
        <FilterSelect label="Plan" value={planCode} onChange={setPlanCode} options={["Free", "Plus", "Pro", "Garden"]} />
        <FilterSelect label="Page size" value={pageSize} onChange={(value) => { setPageSize(value || "15"); setPage(1); }} options={["10", "15", "25", "50"]} />
      </SearchFilters>
      {query.isError ? <ErrorState message="Payments could not be loaded." onRetry={() => query.refetch()} /> : <Card className="min-w-0 overflow-hidden p-1.5"><div className="min-w-0 rounded-[1.05rem] bg-white"><DataTable columns={paymentColumns} rows={query.data?.data} loading={query.isLoading} emptyTitle="No payments found" emptyDescription="No transactions match the current search and filters." emptyAction={<Button variant="secondary" onClick={() => { setSearch(""); setStatus(""); setProvider(""); setPlanCode(""); setPage(1); }}>Clear filters</Button>} /><Pagination pagination={query.data?.pagination} page={page} setPage={setPage} /></div></Card>}
    </div>
  );
}

export const paymentColumns = [
  { key: "id", header: "Transaction", render: (p: PaymentTransaction) => <Link className="group/payment block min-w-0" to={`/payments/${p.paymentTransactionId}`}><span className="block max-w-[13rem] truncate font-semibold text-forest-950 group-hover/payment:underline">{p.orderCode || p.paymentTransactionId}</span><span className="block max-w-[13rem] truncate text-xs font-normal text-forest-900/55">{p.paymentTransactionId}</span></Link> },
  { key: "user", header: "User email", render: (p: PaymentTransaction) => <span className="block max-w-[14rem] truncate text-sm text-forest-900/70">{p.userEmail || "Unknown user"}</span> },
  { key: "provider", header: "Provider", render: (p: PaymentTransaction) => <ProviderBadge provider={p.provider} /> },
  { key: "status", header: "Status", render: (p: PaymentTransaction) => <PaymentStatusBadge status={p.status} /> },
  { key: "plan", header: "Plan", render: (p: PaymentTransaction) => <PlanBadge plan={p.planCode} /> },
  { key: "amount", header: "Amount", render: (p: PaymentTransaction) => <span className="tabular text-sm font-semibold text-forest-950">{formatMoney(p.amount, p.currency)}</span> },
  { key: "created", header: "Created", render: (p: PaymentTransaction) => <span className="text-sm text-forest-900/62">{formatDate(p.createdAt)}</span> },
  { key: "paid", header: "Paid", render: (p: PaymentTransaction) => <span className="text-sm text-forest-900/62">{formatDate(p.paidAt)}</span> },
  { key: "action", header: "", className: "text-right", render: (p: PaymentTransaction) => <Button asChild variant="secondary" className="h-9 rounded-xl px-3"><Link to={`/payments/${p.paymentTransactionId}`}>Open <ArrowUpRight className="h-3.5 w-3.5" /></Link></Button> }
];
