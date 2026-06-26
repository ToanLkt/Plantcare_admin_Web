import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export function LoadingRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-xl bg-sage-100" />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-sage-200/80 bg-gradient-to-br from-white to-sage-100/55 p-8 text-center shadow-card">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest-900 ring-1 ring-forest-900/5">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-forest-950">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-forest-900/70">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-forest-950">Could not load data</h3>
          <p className="mt-1 text-sm text-forest-900/70">{message}</p>
        </div>
        {onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
