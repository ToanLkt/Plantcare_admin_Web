import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeCheck, BadgeDollarSign, BellOff, Bot, CheckCircle2, Edit3, Eye, Leaf, PackageCheck, RefreshCw, Sparkles, X, XCircle } from "lucide-react";
import { getAdminSubscriptionPlans, updateAdminSubscriptionPlan } from "../features/admin/adminApi";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../lib/queryKeys";
import { formatMoney } from "../lib/format";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { EmptyState, ErrorState, LoadingRows } from "../components/ui/State";
import type { SubscriptionPlan } from "../types/admin";
import type { LucideIcon } from "lucide-react";

export function SubscriptionPlansPage() {
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const query = useQuery({ queryKey: queryKeys.plans, queryFn: getAdminSubscriptionPlans });
  const mutation = useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: Partial<SubscriptionPlan> }) => updateAdminSubscriptionPlan(code, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
      setEditing(null);
    }
  });

  if (query.isLoading) return <LoadingRows rows={6} />;
  if (query.isError) return <ErrorState message="Subscription plans could not be loaded." onRetry={() => query.refetch()} />;

  const plans = query.data || [];
  const activePlans = plans.filter((plan) => plan.isActive !== false).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/66 p-1.5 shadow-card ring-1 ring-forest-900/[0.03]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white via-white to-mint/45 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-xl bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest-900">
                <PackageCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                Plan management
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-forest-950">Subscription plans</h1>
              <p className="mt-2 text-sm leading-6 text-forest-900/62">Manage pricing, limits, AI quotas, ads, and availability for PlantCare Hub subscriptions.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SummaryMetric label="Plans" value={plans.length} />
              <SummaryMetric label="Active" value={activePlans} />
              <Button variant="secondary" onClick={() => query.refetch()}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            </div>
          </div>
        </div>
      </section>

      {plans.length ? (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {plans.map((plan) => <PlanCard key={plan.code} plan={plan} onEdit={() => setEditing(plan)} />)}
        </div>
      ) : (
        <EmptyState title="No subscription plans" description="Plans returned by the admin API will appear here." />
      )}

      {editing ? <PlanEditor plan={editing} saving={mutation.isPending} onClose={() => setEditing(null)} onSubmit={(payload) => mutation.mutate({ code: editing.code, payload })} /> : null}
    </div>
  );
}

function PlanCard({ plan, onEdit }: { plan: SubscriptionPlan; onEdit: () => void }) {
  const features = Array.isArray(plan.features) ? plan.features : [];
  return (
    <Card className="overflow-hidden p-1.5">
      <div className="flex h-full flex-col rounded-[1.05rem] bg-gradient-to-br from-white to-sage-100/50">
        <CardHeader className="border-b-0 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-forest-900/45">{plan.code}</p>
              <h2 className="mt-1 truncate text-xl font-semibold tracking-[-0.02em] text-forest-950">{plan.name || plan.code}</h2>
            </div>
            <Badge tone={plan.isActive === false ? "danger" : "success"}>
              {plan.isActive === false ? <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} /> : <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />}
              {plan.isActive === false ? "Inactive" : "Active"}
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="neutral"><Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} /> {plan.planGroup || "No group"}</Badge>
            <Badge tone={plan.showAds ? "warning" : "mint"}>{plan.showAds ? <Eye className="h-3.5 w-3.5" strokeWidth={1.8} /> : <BellOff className="h-3.5 w-3.5" strokeWidth={1.8} />} {plan.showAds ? "Ads shown" : "No ads"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-5 pt-2">
          <div>
            <p className="text-3xl font-semibold tabular tracking-[-0.04em] text-forest-950">{formatMoney(plan.price, plan.currency)}</p>
            <p className="mt-1 text-sm font-medium text-forest-900/55">per {plan.billingCycle || "billing cycle"}</p>
          </div>
          <p className="min-h-12 text-sm leading-6 text-forest-900/68">{plan.description || "No description returned for this plan."}</p>
          <div className="grid grid-cols-2 gap-3">
            <Info label="Max plants" value={String(plan.maxPlants ?? "Unknown")} icon={Leaf} />
            <Info label="AI quota" value={`${plan.aiQuotaLimit ?? "Unknown"} ${plan.aiQuotaPeriod || ""}`} icon={Bot} />
            <Info label="Currency" value={plan.currency || "Unknown"} icon={BadgeDollarSign} />
            <Info label="Cycle" value={plan.billingCycle || "Unknown"} icon={BadgeCheck} />
          </div>
          {features.length ? (
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-xs font-semibold text-forest-900/48">Features</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {features.map((feature) => <Badge key={feature} tone="neutral" className="max-w-full whitespace-normal text-left">{feature}</Badge>)}
              </div>
            </div>
          ) : null}
          <Button variant="secondary" className="mt-auto w-full justify-center" onClick={onEdit}><Edit3 className="h-4 w-4" /> Edit plan</Button>
        </CardContent>
      </div>
    </Card>
  );
}

function PlanEditor({ plan, saving, onClose, onSubmit }: { plan: SubscriptionPlan; saving: boolean; onClose: () => void; onSubmit: (payload: Partial<SubscriptionPlan>) => void }) {
  const [form, setForm] = useState({
    name: plan.name || "",
    description: plan.description || "",
    price: String(plan.price ?? 0),
    currency: plan.currency || "VND",
    billingCycle: plan.billingCycle || "",
    maxPlants: String(plan.maxPlants ?? ""),
    aiQuotaLimit: String(plan.aiQuotaLimit ?? ""),
    aiQuotaPeriod: plan.aiQuotaPeriod || "",
    showAds: String(Boolean(plan.showAds)),
    isActive: String(plan.isActive !== false)
  });
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const price = Number(form.price);
    const maxPlants = form.maxPlants === "" ? undefined : Number(form.maxPlants);
    const aiQuotaLimit = form.aiQuotaLimit === "" ? undefined : Number(form.aiQuotaLimit);
    if (Number.isNaN(price) || price < 0) {
      setError("Price must be zero or greater.");
      return;
    }
    if (maxPlants != null && (Number.isNaN(maxPlants) || maxPlants < 0)) {
      setError("Max plants must be zero or greater.");
      return;
    }
    if (aiQuotaLimit != null && (Number.isNaN(aiQuotaLimit) || aiQuotaLimit < 0)) {
      setError("AI quota must be zero or greater.");
      return;
    }
    onSubmit({
      name: form.name,
      description: form.description,
      price,
      currency: form.currency,
      billingCycle: form.billingCycle,
      maxPlants,
      aiQuotaLimit,
      aiQuotaPeriod: form.aiQuotaPeriod,
      showAds: form.showAds === "true",
      isActive: form.isActive === "true"
    });
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-forest-950/20 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-[1.65rem] border border-white/80 bg-white p-2 shadow-elevated ring-1 ring-forest-900/[0.06]">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-white to-sage-100/45 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-forest-900/48">Editing {plan.code}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-forest-950">Plan details</h2>
              <p className="mt-2 text-sm text-forest-900/60">Update pricing, limits, ads, and availability. Changes save through the existing admin endpoint.</p>
            </div>
            <button type="button" onClick={onClose} className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-forest-900 shadow-card hover:bg-mint">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Name"><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></Field>
            <Field label="Currency"><Input value={form.currency} onChange={(e) => update("currency", e.target.value)} /></Field>
            <Field label="Price"><Input type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} /></Field>
            <Field label="Billing cycle"><Input value={form.billingCycle} onChange={(e) => update("billingCycle", e.target.value)} /></Field>
            <Field label="Max plants"><Input type="number" min="0" value={form.maxPlants} onChange={(e) => update("maxPlants", e.target.value)} /></Field>
            <Field label="AI quota limit"><Input type="number" min="0" value={form.aiQuotaLimit} onChange={(e) => update("aiQuotaLimit", e.target.value)} /></Field>
            <Field label="AI quota period"><Input value={form.aiQuotaPeriod} onChange={(e) => update("aiQuotaPeriod", e.target.value)} /></Field>
            <Field label="Show ads"><Select value={form.showAds} onChange={(e) => update("showAds", e.target.value)}><option value="true">Show ads</option><option value="false">Hide ads</option></Select></Field>
            <Field label="Active state"><Select value={form.isActive} onChange={(e) => update("isActive", e.target.value)}><option value="true">Active</option><option value="false">Inactive</option></Select></Field>
            <label className="md:col-span-2">
              <span className="mb-2 block text-xs font-semibold text-forest-900/55">Description</span>
              <textarea className="focus-ring min-h-28 w-full rounded-2xl border border-sage-200 bg-white px-3 py-3 text-sm text-forest-950 placeholder:text-forest-900/40" value={form.description} onChange={(e) => update("description", e.target.value)} />
            </label>
          </div>
          {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-700/10">{error}</p> : null}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button disabled={saving}>Save plan</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-forest-900/[0.04]"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-900/42">{label}</p><p className="mt-1 text-2xl font-semibold tabular tracking-[-0.03em] text-forest-950">{value}</p></div>;
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return <div className="rounded-2xl bg-white p-3 shadow-card"><p className="flex items-center gap-2 text-xs font-semibold text-forest-900/48"><Icon className="h-3.5 w-3.5" strokeWidth={1.8} /> {label}</p><p className="mt-1 break-words text-sm font-semibold text-forest-950">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="mb-2 block text-xs font-semibold text-forest-900/55">{label}</span>{children}</label>;
}
