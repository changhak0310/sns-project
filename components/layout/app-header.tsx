import { ArrowLeft, Menu } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { AppHeaderProps } from "@/types/app-shell";

const HEADER_LABELS = {
  SUB_ROUTE: "Sub Route",
  MAIN_SHELL: "Main Shell",
} as const;

export function AppHeader({
  title,
  showBackButton,
  showMenuButton,
  onBack,
  onMenuClick,
  rightAction,
}: AppHeaderProps) {
  return (
    <header className="border-b border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface-backdrop)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-[var(--ds-content-default)] items-center gap-3 px-4 sm:px-5">
        <div className="flex min-w-10 items-center justify-start">
          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)]"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : showMenuButton ? (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ds-shell-text-muted)]">
            {showBackButton ? HEADER_LABELS.SUB_ROUTE : HEADER_LABELS.MAIN_SHELL}
          </p>
          <p className="truncate font-display text-[1.6rem] leading-none tracking-[-0.05em] text-[var(--ds-shell-text)]">
            {title}
          </p>
        </div>

        <div
          className={cn(
            "flex min-w-10 items-center justify-end",
            !rightAction && "invisible"
          )}
        >
          {rightAction ?? <span className="h-10 w-10" aria-hidden="true" />}
        </div>
      </div>
    </header>
  );
}
