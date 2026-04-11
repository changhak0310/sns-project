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
        sm: "px-2.5 py-1 text-[11px]",
        md: "px-3 py-1.5 text-xs",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        tone: "neutral",
        className:
          "bg-[var(--ds-color-primary-900)] text-[var(--ds-color-neutral-0)]",
      },
      {
        variant: "soft",
        tone: "neutral",
        className:
          "bg-[var(--ds-color-neutral-100)] text-[var(--ds-color-neutral-700)]",
      },
      {
        variant: "outline",
        tone: "neutral",
        className:
          "border-[var(--ds-border-subtle)] text-[var(--ds-color-neutral-700)]",
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
          "bg-[var(--ds-color-accent-100)] text-[var(--ds-color-accent-500)]",
      },
      {
        variant: "outline",
        tone: "accent",
        className:
          "border-[var(--ds-color-accent-300)] text-[var(--ds-color-accent-500)]",
      },
      {
        variant: "soft",
        tone: "success",
        className:
          "bg-[var(--ds-color-success-100)] text-[var(--ds-color-success-500)]",
      },
      {
        variant: "soft",
        tone: "warning",
        className:
          "bg-[var(--ds-color-warning-100)] text-[var(--ds-color-warning-600)]",
      },
      {
        variant: "soft",
        tone: "error",
        className:
          "bg-[var(--ds-color-error-100)] text-[var(--ds-color-error-500)]",
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
