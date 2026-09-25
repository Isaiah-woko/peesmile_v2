import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ControlProps = {
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
};

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  hint,
  error,
  required,
  optional,
  children,
  className,
}: FieldProps) {
  const fallbackId = useId();
  const isControl = isValidElement<ControlProps>(children);
  const controlId = isControl && children.props.id ? children.props.id : fallbackId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const control = isControl
    ? cloneElement(children as ReactElement<ControlProps>, {
        id: controlId,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={controlId}
        className="text-body-small font-body font-medium text-ink"
      >
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-ash">(optional)</span>
        ) : null}
        {required ? (
          <span className="ml-1 text-ember" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {control}

      {hint && !error ? (
        <p id={hintId} className="text-body-small text-ash">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-body-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}