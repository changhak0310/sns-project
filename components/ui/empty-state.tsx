import type { ReactNode } from "react";
import { Compass } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const toneClass = {
  neutral:
    "bg-[var(--ds-color-neutral-0)] text-[var(--ds-color-primary-900)]",
  accent:
    "bg-[var(--ds-mood-discover-bg)] text-[var(--ds-color-primary-900)]",
  alert:
    "bg-[var(--ds-mood-alert-bg)] text-[var(--ds-color-warning-700)]",
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
        "flex flex-col items-center justify-center gap-4 rounded-[var(--ds-radius-xl)] border border-[var(--ds-border-subtle)] px-6 py-10 text-center shadow-[var(--ds-shadow-sm)]",
        toneClass[tone],
        className
      )}
    >
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--ds-color-neutral-0)] shadow-[var(--ds-shadow-sm)]">
        {visual ?? <Compass className="size-6 text-[var(--ds-color-accent-500)]" aria-hidden />}
      </span>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="max-w-sm text-sm leading-6 text-[var(--ds-color-neutral-600)]">
          {description}
        </p>
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
