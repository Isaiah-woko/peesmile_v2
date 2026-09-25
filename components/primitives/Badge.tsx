import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "accent";

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "border-rule text-ink-soft",
  success: "border-pine/40 text-pine",
  warning: "border-signal/60 text-ink-soft",
  danger: "border-error/40 text-error",
  accent: "border-ember/40 text-ember",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", dot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-body-small",
        badgeVariants[variant],
        className
      )}
    >
      {dot ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}