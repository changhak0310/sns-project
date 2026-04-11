import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const inputWrapperVariants = cva(
  "group flex min-h-12 items-center gap-3 rounded-[var(--ds-radius-md)] border bg-[var(--ds-color-neutral-0)] px-4 transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-within:border-[var(--ds-color-primary-900)] focus-within:shadow-[0_0_0_4px_var(--ds-color-accent-100)]",
  {
    variants: {
      variant: {
        default: "border-[var(--ds-border-subtle)]",
        quiet: "border-transparent bg-[var(--ds-color-neutral-100)] focus-within:bg-[var(--ds-color-neutral-0)]",
        search: "rounded-full border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)]",
      },
      hasError: {
        true: "border-[var(--ds-color-error-500)] focus-within:border-[var(--ds-color-error-500)] focus-within:shadow-[0_0_0_4px_var(--ds-color-error-100)]",
        false: "",
      },
      disabled: {
        true: "opacity-60",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hasError: false,
      disabled: false,
    },
  }
);

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size"> &
  VariantProps<typeof inputWrapperVariants> & {
    error?: string;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      error,
      leadingIcon,
      trailingIcon,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            inputWrapperVariants({
              variant,
              hasError: Boolean(error),
              disabled,
            }),
            className
          )}
        >
          {leadingIcon ? (
            <span
              aria-hidden
              className="inline-flex shrink-0 items-center justify-center text-[var(--ds-color-neutral-500)]"
            >
              {leadingIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className="w-full border-none bg-transparent text-base text-[var(--ds-color-neutral-950)] outline-none placeholder:text-[var(--ds-color-neutral-500)]"
            {...props}
          />
          {trailingIcon ? (
            <span
              aria-hidden
              className="inline-flex shrink-0 items-center justify-center text-[var(--ds-color-neutral-500)]"
            >
              {trailingIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <p className="text-sm leading-6 text-[var(--ds-color-error-500)]">{error}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
