import { cn } from "@/lib/utils";

export interface TicketEdgeProps {
  className?: string;
  color?: string;
}

export function TicketEdge({ className, color = "var(--color-rule)" }: TicketEdgeProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("block h-3px w-full", className)}
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="1.5"
        x2="100%"
        y2="1.5"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
    </svg>
  );
}