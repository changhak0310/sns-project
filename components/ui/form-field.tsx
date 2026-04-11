import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type FormFieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  description,
  error,
  required = false,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-[var(--ds-color-neutral-900)]"
        >
          {label}
          {required ? <span className="ml-1 text-[var(--ds-color-accent-500)]">*</span> : null}
        </label>
      ) : null}
      {description ? (
        <p className="text-sm leading-6 text-[var(--ds-color-neutral-600)]">{description}</p>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm leading-6 text-[var(--ds-color-error-500)]">{error}</p>
      ) : null}
    </div>
  );
}
