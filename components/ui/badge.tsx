import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.04em] uppercase",
  {
    variants: {
      variant: {
        solid: "border-transparent",
        soft: "border-transparent",
        outline: "bg-transparent",
      },
      tone: {
        neutral: "",
        primary: "",
        accent: "",
        success: "",
        warning: "",
        error: "",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[8px]",
        md: "px-3 py-1.5 text-xs",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        tone: "neutral",
        className:
          "bg-[var(--ds-ui-primary-bg)] text-[var(--ds-ui-primary-text)]",
      },
      {
        variant: "soft",
        tone: "neutral",
        className:
          "bg-[var(--ds-ui-neutral-soft-bg)] text-[var(--ds-ui-neutral-soft-text)]",
      },
      {
        variant: "outline",
        tone: "neutral",
        className:
          "border-[var(--ds-ui-border-subtle)] text-[var(--ds-ui-text-secondary)]",
      },
      {
        variant: "solid",
        tone: "accent",
        className:
          "bg-[var(--ds-color-accent-500)] text-[var(--ds-color-neutral-0)]",
      },
      {
        variant: "soft",
        tone: "accent",
        className:
          "bg-[var(--ds-ui-accent-soft-bg)] text-[var(--ds-ui-accent-soft-text)]",
      },
      {
        variant: "outline",
        tone: "accent",
        className:
          "border-[var(--ds-color-accent-300)] text-[var(--ds-ui-accent-soft-text)]",
      },
      {
        variant: "soft",
        tone: "success",
        className:
          "bg-[var(--ds-ui-success-soft-bg)] text-[var(--ds-ui-success-soft-text)]",
      },
      {
        variant: "soft",
        tone: "warning",
        className:
          "bg-[var(--ds-ui-warning-soft-bg)] text-[var(--ds-ui-warning-soft-text)]",
      },
      {
        variant: "soft",
        tone: "error",
        className:
          "bg-[var(--ds-ui-error-soft-bg)] text-[var(--ds-ui-error-soft-text)]",
      },
    ],
    defaultVariants: {
      variant: "soft",
      tone: "neutral",
      size: "md",
    },
  }
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Badge({ icon, children, className, variant, tone, size }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, tone, size }), className)}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}
