import { ArrowLeft, Menu } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { AppHeaderProps } from "@/types/app-shell";

export function AppHeader({
  title,
  showBackButton,
  showMenuButton,
  onBack,
  onMenuClick,
  rightAction,
}: AppHeaderProps) {
  return (
    <header className="border-b border-[var(--ds-border-subtle)] bg-[rgba(251,248,243,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[var(--ds-content-default)] items-center gap-3 px-4 lg:h-20 lg:px-6">
        <div className="flex min-w-10 items-center justify-start">
        {showBackButton ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ds-border-subtle)] bg-[rgba(255,255,255,0.72)] text-[var(--ds-color-primary-900)] transition duration-200 hover:border-[var(--ds-border-strong)] hover:bg-[var(--ds-color-neutral-0)]"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : showMenuButton ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ds-border-subtle)] bg-[rgba(255,255,255,0.72)] text-[var(--ds-color-primary-900)] transition duration-200 hover:border-[var(--ds-border-strong)] hover:bg-[var(--ds-color-neutral-0)] lg:hidden"
            aria-label="메뉴 열기"
          >
            <Menu className="h-4 w-4" />
          </button>
        ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ds-color-neutral-500)]">
            {showBackButton ? "Sub Route" : "Main Shell"}
          </p>
          <p className="truncate font-display text-[1.7rem] leading-none tracking-[-0.05em] text-[var(--ds-color-primary-900)] lg:text-[2rem]">
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
