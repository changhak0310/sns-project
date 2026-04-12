import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-accent-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-ui-focus-offset)] disabled:pointer-events-none disabled:opacity-55 aria-busy:pointer-events-none",
  {
    variants: {
      size: {
        sm: "size-10",
        md: "size-11",
        lg: "size-13",
      },
      tone: {
        default:
          "border-[var(--ds-ui-border-subtle)] bg-[var(--ds-ui-surface)] text-[var(--ds-ui-text-primary)] hover:bg-[var(--ds-ui-surface-muted)]",
        accent:
          "border-transparent bg-[var(--ds-ui-accent-soft-bg)] text-[var(--ds-ui-accent-soft-text)] hover:bg-[rgba(239,109,71,0.22)]",
        danger:
          "border-transparent bg-[var(--ds-ui-error-soft-bg)] text-[var(--ds-ui-error-soft-text)] hover:bg-[rgba(209,82,82,0.24)]",
      },
      active: {
        true: "shadow-[var(--ds-ui-shadow-sm)]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
      active: false,
    },
  }
);

type IconButtonProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> &
  VariantProps<typeof iconButtonVariants> & {
    icon: React.ReactNode;
    label: string;
    loading?: boolean;
  };

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      size,
      tone,
      active,
      icon,
      label,
      loading = false,
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
        className={cn(iconButtonVariants({ size, tone, active }), className)}
        aria-label={label}
        aria-busy={loading}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
          />
        ) : (
          <span aria-hidden className="inline-flex items-center justify-center">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
export type { IconButtonProps };
