import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { BottomNavProps } from "@/types/app-shell";

import { NavIcon } from "./nav-icon";

export function BottomNav({ navItems, activeHref }: BottomNavProps) {
  const activeIndex = navItems.findIndex((item) => item.href === activeHref);

  return (
    <nav className="mx-auto w-full max-w-xl rounded-t-[34px] border border-b-0 border-[var(--ds-border-subtle)] bg-[rgba(255,255,255,0.94)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-[var(--ds-shadow-lg)] backdrop-blur-xl">
      <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[var(--ds-color-neutral-200)]" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ds-color-neutral-500)]">
            Quick Move
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--ds-color-neutral-700)]">
            메인 셸 핵심 이동만 먼저 고정했습니다.
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
                  ? "border border-[rgba(22,28,36,0.12)] bg-[linear-gradient(135deg,var(--ds-color-accent-500),var(--ds-color-accent-600))] text-white shadow-[var(--ds-shadow-md)]"
                  : isPrimary
                    ? "bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] text-white shadow-[var(--ds-shadow-sm)]"
                  : "border border-transparent text-[var(--ds-color-neutral-600)] hover:border-[var(--ds-border-subtle)] hover:bg-[var(--ds-color-neutral-50)]",
                isActive &&
                  !isPrimary &&
                  "border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] text-[var(--ds-color-neutral-950)]"
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
