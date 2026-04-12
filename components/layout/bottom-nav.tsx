import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { BottomNavProps } from "@/types/app-shell";

import { NavIcon } from "./nav-icon";

export function BottomNav({ navItems, activeHref }: BottomNavProps) {
  const activeIndex = navItems.findIndex((item) => item.href === activeHref);

  return (
    <nav className="mx-auto w-full max-w-md rounded-t-[30px] border border-b-0 border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface-floating)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-[0_-18px_42px_rgba(0,0,0,0.36)] backdrop-blur-2xl">
      <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[var(--ds-shell-handle)]" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ds-shell-text-muted)]">
            Quick Move
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--ds-shell-text-muted)]">
            Feed, create, and profile stay one tap away.
          </p>
        </div>
        <Badge variant="soft" tone="accent" size="sm">
          3 links
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isPrimary = item.href === "/create";

          return (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-[22px] px-3 py-3 text-xs font-semibold tracking-[0.04em] transition duration-200",
                isPrimary && isActive
                  ? "border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] text-white shadow-[0_18px_32px_rgba(239,109,71,0.28)]"
                  : isPrimary
                    ? "bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] text-white shadow-[0_12px_24px_rgba(239,109,71,0.24)]"
                    : "border border-transparent text-[var(--ds-shell-text-muted)] hover:border-[var(--ds-shell-border)] hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]",
                isActive &&
                  !isPrimary &&
                  "border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)]"
              )}
            >
              <NavIcon name={item.icon} className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
