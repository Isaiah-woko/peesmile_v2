import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap",
  "rounded-md font-body font-medium",
  "transition-colors duration-[120ms]",
  "active:translate-y-px",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ember text-paper hover:bg-ember-deep",
  outline: "border border-ink bg-transparent text-ink hover:bg-bone",
  ghost: "bg-transparent text-ink hover:bg-bone",
  dark: "bg-paper text-ink hover:bg-bone",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-body-small",
  md: "h-11 px-5 text-body-0",
  lg: "h-12 px-6 text-body-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", asChild = false, className, type, disabled, ...props },
  ref
) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (asChild) {
    return <Slot ref={ref} className={classes} {...props} />;
  }

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      disabled={disabled}
      className={classes}
      {...props}
    />
  );
});