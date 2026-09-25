import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StampProps {
  children: ReactNode;
  className?: string;
}

export function Stamp({ children, className }: StampProps) {
  return (
    <span
      className={cn(
        "mono-label letterpress inline-block border border-current px-3 py-1 text-body-small",
        className
      )}
    >
      {children}
    </span>
  );
}