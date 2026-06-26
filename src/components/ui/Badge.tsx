import { CheckCircle2, CircleDashed, Clock3, Crown, LockKeyhole, Shield, Sprout, WalletCards, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export function Badge({ className, tone = "neutral", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "success" | "warning" | "danger" | "mint" | "forest" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tone === "neutral" && "bg-sage-100 text-forest-900 ring-forest-900/5",
        tone === "success" && "bg-emerald-50 text-emerald-700 ring-emerald-700/10",
        tone === "warning" && "bg-amber-50 text-amber-700 ring-amber-700/10",
        tone === "danger" && "bg-red-50 text-red-700 ring-red-700/10",
        tone === "mint" && "bg-mint text-forest-900 ring-forest-900/5",
        tone === "forest" && "bg-forest-900 text-white ring-forest-950/10",
        className
      )}
      {...props}
    />
  );
}

export function RoleBadge({ role }: { role?: string }) {
  const isAdmin = role === "Admin";
  return (
    <Badge tone={isAdmin ? "forest" : "neutral"}>
      {isAdmin ? <Shield className="h-3.5 w-3.5" strokeWidth={1.8} /> : <Sprout className="h-3.5 w-3.5" strokeWidth={1.8} />}
      {role || "Unknown"}
    </Badge>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const locked = status === "Locked";
  return (
    <Badge tone={locked ? "danger" : status ? "success" : "neutral"}>
      {locked ? <LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.8} /> : status ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} /> : <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />}
      {status || "Unknown"}
    </Badge>
  );
}

export function PlanBadge({ plan }: { plan?: string }) {
  const premium = plan === "Pro" || plan === "Garden" || plan === "Plus";
  return (
    <Badge tone={premium ? "mint" : "neutral"}>
      {premium ? <Crown className="h-3.5 w-3.5" strokeWidth={1.8} /> : <CircleDashed className="h-3.5 w-3.5" strokeWidth={1.8} />}
      {plan || "Unknown plan"}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status?: string }) {
  const normalized = status || "Unknown";
  const tone = normalized === "Paid" ? "success" : normalized === "Failed" || normalized === "Expired" ? "danger" : normalized === "Pending" ? "warning" : "neutral";
  return (
    <Badge tone={tone}>
      {normalized === "Paid" ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} /> : normalized === "Failed" || normalized === "Expired" ? <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} /> : <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />}
      {normalized}
    </Badge>
  );
}

export function ProviderBadge({ provider }: { provider?: string }) {
  return (
    <Badge tone="neutral">
      <WalletCards className="h-3.5 w-3.5" strokeWidth={1.8} />
      {provider || "Unknown"}
    </Badge>
  );
}
