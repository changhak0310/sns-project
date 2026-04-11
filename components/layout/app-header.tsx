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
    <div className="flex h-16 items-center gap-3 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 backdrop-blur-sm lg:h-20 lg:px-8">
      <div className="flex min-w-10 items-center justify-start">
        {showBackButton ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-900)] transition hover:border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : showMenuButton ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-900)] transition hover:border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)] lg:hidden"
            aria-label="메뉴 열기"
          >
            <Menu className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-2xl leading-none tracking-tight text-[var(--color-neutral-950)] lg:text-[2rem]">
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
  );
}
