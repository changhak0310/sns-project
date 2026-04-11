import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-accent-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-color-neutral-0)] disabled:pointer-events-none disabled:opacity-55 aria-busy:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[var(--ds-color-primary-900)] text-[var(--ds-color-neutral-0)] shadow-[var(--ds-shadow-sm)] hover:bg-[var(--ds-color-primary-700)] active:scale-[0.99]",
        secondary:
          "border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] text-[var(--ds-color-primary-900)] hover:bg-[var(--ds-color-neutral-50)]",
        ghost:
          "border-transparent bg-transparent text-[var(--ds-color-primary-900)] hover:bg-[var(--ds-color-neutral-100)]",
        outline:
          "border-[var(--ds-border-strong)] bg-transparent text-[var(--ds-color-primary-900)] hover:bg-[var(--ds-color-neutral-0)]",
        danger:
          "border-transparent bg-[var(--ds-color-error-500)] text-[var(--ds-color-neutral-0)] shadow-[var(--ds-shadow-sm)] hover:bg-[var(--ds-color-error-600)] active:scale-[0.99]",
      },
      size: {
        sm: "min-h-10 px-4 text-sm",
        md: "px-5 text-sm",
        lg: "min-h-13 px-6 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean;
    loading?: boolean;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
    />
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner />
            <span>처리 중</span>
          </>
        ) : (
          <>
            {leadingIcon ? (
              <span aria-hidden className="inline-flex items-center justify-center">
                {leadingIcon}
              </span>
            ) : null}
            <span>{children}</span>
            {trailingIcon ? (
              <span aria-hidden className="inline-flex items-center justify-center">
                {trailingIcon}
              </span>
            ) : null}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
