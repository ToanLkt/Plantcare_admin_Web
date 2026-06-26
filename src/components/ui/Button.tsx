import { Slot } from "./Slot";
import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  asChild?: boolean;
};

export function Button({ className, variant = "primary", asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-forest-900 text-white shadow-card hover:bg-forest-800",
        variant === "secondary" && "border border-sage-200 bg-white text-forest-950 hover:bg-sage-100",
        variant === "ghost" && "text-forest-900 hover:bg-sage-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}
