import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { DesktopSidebarProps } from "@/types/app-shell";

import { NavIcon } from "./nav-icon";

export function DesktopSidebar({
  navItems,
  activeHref,
  collapsed,
  onToggleCollapse,
}: DesktopSidebarProps) {
  const activeIndex = navItems.findIndex((item) => item.href === activeHref);

  return (
    <aside
      className={cn(
        "hidden border-r border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] lg:flex lg:min-h-screen lg:flex-col",
        collapsed ? "lg:w-24" : "lg:w-72"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-neutral-200)] px-5 py-6">
        <div className={cn("min-w-0", collapsed && "sr-only")}>
          <p className="font-display text-3xl leading-none text-[var(--color-neutral-950)]">
            Orbit
          </p>
          <p className="mt-2 text-sm text-[var(--color-neutral-500)]">
            Editorial shell
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-900)] transition hover:border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]"
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 축소하기"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          const isPrimary = item.href === "/create";

          return (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold transition",
                collapsed && "justify-center px-0",
                isPrimary
                  ? "bg-[var(--color-accent-300)] text-white shadow-[var(--shadow-sm)]"
                  : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-neutral-950)]",
                isActive &&
                  !isPrimary &&
                  "bg-[var(--color-neutral-50)] text-[var(--color-neutral-950)]"
              )}
            >
              <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-neutral-200)] px-5 py-5">
        {!collapsed ? (
          <p className="text-sm leading-6 text-[var(--color-neutral-500)]">
            공통 기반 단계에서는 셸 배치와 경로 인식을 먼저 고정합니다.
          </p>
        ) : (
          <div className="mx-auto h-3 w-3 rounded-full bg-[var(--color-accent-300)]" />
        )}
      </div>
    </aside>
  );
}
