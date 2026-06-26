import { cn } from "../../lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-10 w-full rounded-xl border border-sage-200 bg-white px-3 text-sm text-forest-950 placeholder:text-forest-900/40",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "focus-ring h-10 rounded-xl border border-sage-200 bg-white px-3 text-sm font-medium text-forest-950",
        className
      )}
      {...props}
    />
  );
}
