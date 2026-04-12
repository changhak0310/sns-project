import type { ReactNode } from "react";
import { Compass } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const toneClass = {
  neutral:
    "bg-[var(--ds-ui-surface)] text-[var(--ds-ui-text-primary)]",
  accent:
    "bg-[var(--ds-ui-accent-soft-bg)] text-[var(--ds-ui-text-primary)]",
  alert:
    "bg-[var(--ds-ui-warning-soft-bg)] text-[var(--ds-ui-warning-soft-text)]",
} as const;

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  visual?: ReactNode;
  tone?: keyof typeof toneClass;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  visual,
  tone = "neutral",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[var(--ds-radius-xl)] border border-[var(--ds-ui-border-subtle)] px-6 py-10 text-center shadow-[var(--ds-ui-shadow-sm)]",
        toneClass[tone],
        className
      )}
    >
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--ds-ui-surface-soft)] shadow-[var(--ds-ui-shadow-sm)]">
        {visual ?? <Compass className="size-6 text-[var(--ds-color-accent-500)]" aria-hidden />}
      </span>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="max-w-sm text-sm leading-6 text-[var(--ds-ui-text-secondary)]">
          {description}
        </p>
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
