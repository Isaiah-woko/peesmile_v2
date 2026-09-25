import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RuleProps {
  label?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function Rule({ label, align = "left", className }: RuleProps) {
  if (!label) {
    return <hr className={cn("h-px w-full border-0 bg-rule", className)} aria-hidden="true" />;
  }

  if (align === "center") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <span className="h-px flex-1 bg-rule" aria-hidden="true" />
        <span className="mono-label whitespace-nowrap text-body-small text-ash">{label}</span>
        <span className="h-px flex-1 bg-rule" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="mono-label whitespace-nowrap text-body-small text-ash">{label}</span>
      <span className="h-px flex-1 bg-rule" aria-hidden="true" />
    </div>
  );
}