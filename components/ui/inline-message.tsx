import type { ReactNode } from "react";
import { AlertCircle, BadgeCheck, CircleAlert, Info } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const toneStyles = {
  neutral:
    "border-[var(--ds-ui-border-subtle)] bg-[var(--ds-ui-surface-soft)] text-[var(--ds-ui-text-secondary)]",
  success:
    "border-transparent bg-[var(--ds-ui-success-soft-bg)] text-[var(--ds-ui-success-soft-text)]",
  warning:
    "border-transparent bg-[var(--ds-ui-warning-soft-bg)] text-[var(--ds-ui-warning-soft-text)]",
  error:
    "border-transparent bg-[var(--ds-ui-error-soft-bg)] text-[var(--ds-ui-error-soft-text)]",
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
