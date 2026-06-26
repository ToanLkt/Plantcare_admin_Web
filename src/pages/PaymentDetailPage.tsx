import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, Copy, CreditCard, ExternalLink, FileCode2, Link2, Mail, ReceiptText, RefreshCw, UserRound, WalletCards } from "lucide-react";
import { getAdminPaymentDetail } from "../features/admin/adminApi";
import { queryKeys } from "../lib/queryKeys";
import { formatDate, formatMoney } from "../lib/format";
import { Button } from "../components/ui/Button";
import { PaymentStatusBadge, PlanBadge, ProviderBadge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { ErrorState, LoadingRows } from "../components/ui/State";
import type { LucideIcon } from "lucide-react";

export function PaymentDetailPage() {
  const { paymentTransactionId = "" } = useParams();
  const query = useQuery({ queryKey: queryKeys.payment(paymentTransactionId), queryFn: () => getAdminPaymentDetail(paymentTransactionId), enabled: !!paymentTransactionId });
  if (!paymentTransactionId) return <ErrorState message="Missing payment transaction id." />;
  if (query.isLoading) return <LoadingRows rows={8} />;
  if (query.isError) return <ErrorState message="Payment detail could not be loaded." onRetry={() => query.refetch()} />;
  const p = query.data;
  if (!p) return <ErrorState message="Payment detail was empty." onRetry={() => query.refetch()} />;
  const transactionLabel = String(p.orderCode || p.paymentTransactionId);
  const rawPayload = { rawMessage: p.rawMessage, metadata: p.metadata };
  const hasRawDetails = Boolean(p.rawMessage || p.metadata);
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <Button asChild variant="ghost" className="mb-2 h-8 px-2 text-forest-900/62"><Link to="/payments"><ArrowLeft className="h-4 w-4" /> Back to payments</Link></Button>
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
                <ReceiptText className="h-3.5 w-3.5" strokeWidth={1.8} />
                Payment detail
              </p>
              <h1 className="break-words text-4xl font-semibold tracking-[-0.04em] text-forest-950">Payment {transactionLabel}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-forest-900/62"><Mail className="h-4 w-4" strokeWidth={1.8} /> {p.userEmail || "Unknown user"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <PaymentStatusBadge status={p.status} />
                <ProviderBadge provider={p.provider} />
                <PlanBadge plan={p.planCode} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={String(p.paymentTransactionId)} label="Copy ID" />
              {p.orderCode ? <CopyButton value={String(p.orderCode)} label="Copy order" /> : null}
              <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </div>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1fr_25rem]">
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-white">
            <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><CreditCard className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Amount summary</h2></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <Info icon={CreditCard} label="Amount" value={formatMoney(p.amount, p.currency)} prominent />
              <Info icon={WalletCards} label="Provider" value={p.provider || "Unknown"} />
              <Info icon={ReceiptText} label="Order code" value={p.orderCode || "Unknown"} copyValue={p.orderCode} />
              <Info icon={ReceiptText} label="Transaction ID" value={String(p.paymentTransactionId)} copyValue={String(p.paymentTransactionId)} />
              <Info icon={UserRound} label="User ID" value={String(p.userId || p.userID || "Unknown")} />
              <Info icon={Mail} label="User email" value={p.userEmail || "Unknown"} />
            </CardContent>
          </div>
        </Card>
        <Card className="overflow-hidden p-1.5">
          <div className="rounded-[1.05rem] bg-gradient-to-br from-white to-sage-100/50">
            <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><Link2 className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Links</h2></CardHeader>
            <CardContent className="space-y-3">
              {p.userId || p.userID ? <Button asChild variant="secondary" className="w-full justify-between"><Link to={`/users/${p.userId || p.userID}`}>Open related user <ExternalLink className="h-4 w-4" /></Link></Button> : null}
              {p.checkoutUrl ? (
                <>
                  <Button asChild className="w-full justify-between"><a href={p.checkoutUrl} target="_blank" rel="noreferrer">Open checkout <ExternalLink className="h-4 w-4" /></a></Button>
                  <CopyButton value={p.checkoutUrl} label="Copy checkout URL" className="w-full justify-center" />
                  <p className="break-all rounded-2xl bg-white p-3 text-xs leading-5 text-forest-900/58 shadow-card">{p.checkoutUrl}</p>
                </>
              ) : <p className="rounded-2xl bg-white p-4 text-sm text-forest-900/60 shadow-card">No checkout URL returned.</p>}
            </CardContent>
          </div>
        </Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <DetailCard title="Plan and provider" icon={WalletCards}>
          <Info icon={WalletCards} label="Provider" value={p.provider || "Unknown"} />
          <Info icon={CreditCard} label="Plan" value={p.planCode || "Unknown"} />
          <Info icon={ReceiptText} label="Currency" value={p.currency || "Unknown"} />
        </DetailCard>
        <DetailCard title="Timestamps" icon={CalendarClock} className="xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-3">
            <Info icon={CalendarClock} label="Created" value={formatDate(p.createdAt)} />
            <Info icon={CalendarClock} label="Paid" value={formatDate(p.paidAt)} />
            <Info icon={CalendarClock} label="Expires" value={formatDate(p.expiresAt)} />
          </div>
        </DetailCard>
      </div>
      <Card className="overflow-hidden p-1.5">
        <div className="rounded-[1.05rem] bg-white">
          <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><FileCode2 className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> Raw message and metadata</h2></CardHeader>
          <CardContent>{hasRawDetails ? <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-forest-950 p-4 text-xs leading-6 text-mint">{JSON.stringify(rawPayload, null, 2)}</pre> : <p className="rounded-2xl bg-sage-100 p-5 text-sm text-forest-900/62">No raw message or metadata returned for this transaction.</p>}</CardContent>
        </div>
      </Card>
    </div>
  );
}

function Info({ icon: Icon, label, value, copyValue, prominent }: { icon: LucideIcon; label: string; value: string; copyValue?: string; prominent?: boolean }) {
  return (
    <div className="rounded-2xl bg-sage-100/70 p-4 ring-1 ring-forest-900/[0.03]">
      <div className="flex items-center gap-2 text-xs font-semibold text-forest-900/48"><Icon className="h-3.5 w-3.5" strokeWidth={1.8} />{label}</div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className={prominent ? "break-words text-2xl font-semibold tabular tracking-[-0.03em] text-forest-950" : "break-words text-sm font-semibold text-forest-950"}>{value}</p>
        {copyValue ? <button className="focus-ring grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-forest-900 shadow-card transition hover:bg-mint" onClick={() => navigator.clipboard.writeText(copyValue)} aria-label={`Copy ${label}`}><Copy className="h-3.5 w-3.5" strokeWidth={1.8} /></button> : null}
      </div>
    </div>
  );
}

function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  return <Button variant="secondary" className={className} onClick={() => navigator.clipboard.writeText(value)}><Copy className="h-4 w-4" /> {label}</Button>;
}

function DetailCard({ title, icon: Icon, children, className }: { title: string; icon: LucideIcon; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`overflow-hidden p-1.5 ${className || ""}`}>
      <div className="h-full rounded-[1.05rem] bg-white">
        <CardHeader className="border-b-0 pb-2"><h2 className="flex items-center gap-2 font-semibold"><Icon className="h-4 w-4 text-forest-800" strokeWidth={1.8} /> {title}</h2></CardHeader>
        <CardContent className="space-y-3">{children}</CardContent>
      </div>
    </Card>
  );
}
