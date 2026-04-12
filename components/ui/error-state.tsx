import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
  title: string;
  description: string;
  retryAction?: ReactNode;
  tone?: "alert" | "neutral";
  className?: string;
};

export function ErrorState({
  title,
  description,
  retryAction,
  tone = "alert",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[var(--ds-radius-xl)] border px-5 py-6 shadow-[var(--ds-ui-shadow-sm)]",
        tone === "alert"
          ? "border-transparent bg-[var(--ds-ui-warning-soft-bg)]"
          : "border-[var(--ds-ui-border-subtle)] bg-[var(--ds-ui-surface)]",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--ds-ui-surface-soft)] text-[var(--ds-color-error-500)]">
          <AlertCircle className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <h3 className="text-base font-semibold tracking-[-0.03em] text-[var(--ds-ui-text-primary)]">
            {title}
          </h3>
          <p className="text-sm leading-6 text-[var(--ds-ui-text-secondary)]">{description}</p>
        </div>
      </div>
      <div>
        {retryAction ?? (
          <Button variant="secondary" size="sm">
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}
