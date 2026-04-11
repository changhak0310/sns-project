import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import type { BottomNavProps } from "@/types/app-shell";

import { NavIcon } from "./nav-icon";

export function BottomNav({ navItems, activeHref }: BottomNavProps) {
  const activeIndex = navItems.findIndex((item) => item.href === activeHref);

  return (
    <nav className="mx-auto w-full max-w-xl rounded-t-[30px] border border-b-0 border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-[var(--shadow-md)]">
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
                "flex min-h-16 flex-col items-center justify-center gap-2 rounded-[22px] px-3 py-3 text-xs font-semibold tracking-[0.04em] transition",
                isPrimary
                  ? "bg-[var(--color-accent-300)] text-white"
                  : "border border-transparent text-[var(--color-neutral-600)] hover:border-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-50)]",
                isActive &&
                  !isPrimary &&
                  "border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] text-[var(--color-neutral-950)]"
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
