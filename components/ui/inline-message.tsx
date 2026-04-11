import type { ReactNode } from "react";
import { AlertCircle, BadgeCheck, CircleAlert, Info } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const toneStyles = {
  neutral:
    "border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-100)] text-[var(--ds-color-neutral-700)]",
  success:
    "border-transparent bg-[var(--ds-color-success-100)] text-[var(--ds-color-success-500)]",
  warning:
    "border-transparent bg-[var(--ds-color-warning-100)] text-[var(--ds-color-warning-600)]",
  error:
    "border-transparent bg-[var(--ds-color-error-100)] text-[var(--ds-color-error-500)]",
} as const;

const toneIcons = {
  neutral: Info,
  success: BadgeCheck,
  warning: CircleAlert,
  error: AlertCircle,
} as const;

type InlineMessageProps = {
  tone?: keyof typeof toneStyles;
  icon?: ReactNode;
  message: ReactNode;
  className?: string;
};

export function InlineMessage({
  tone = "neutral",
  icon,
  message,
  className,
}: InlineMessageProps) {
  const Icon = toneIcons[tone];

  return (
    <div
      className={cn(
        "inline-flex items-start gap-2 rounded-[var(--ds-radius-md)] border px-3 py-2 text-sm leading-6",
        toneStyles[tone],
        className
      )}
      role="status"
    >
      <span className="mt-0.5 shrink-0" aria-hidden>
        {icon ?? <Icon className="size-4" />}
      </span>
      <span>{message}</span>
    </div>
  );
}
