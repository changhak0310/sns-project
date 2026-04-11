import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
        "hidden lg:flex lg:min-h-screen lg:flex-col lg:px-4 lg:py-4",
        collapsed ? "lg:w-32" : "lg:w-80"
      )}
    >
      <div className="sticky top-4 flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[34px] border border-[var(--ds-border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.74))] shadow-[var(--ds-shadow-md)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--ds-border-subtle)] px-5 py-6">
          <div className={cn("min-w-0", collapsed && "sr-only")}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ds-color-neutral-500)]">
              Main Navigation
            </p>
            <p className="mt-2 font-display text-3xl leading-none tracking-[-0.05em] text-[var(--ds-color-primary-900)]">
              Orbit
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
              대시보드보다 가볍고, 에디토리얼 앱처럼 읽히는 셸입니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-0)] text-[var(--ds-color-primary-900)] transition hover:border-[var(--ds-border-strong)] hover:bg-[var(--ds-color-neutral-50)]"
            aria-label={collapsed ? "사이드바 펼치기" : "사이드바 축소하기"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {!collapsed ? (
          <div className="px-5 pt-4">
            <Badge variant="soft" tone="accent" size="sm">
              Common Foundation
            </Badge>
          </div>
        ) : null}

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
                  "flex min-h-14 items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold transition duration-200",
                  collapsed && "justify-center px-0",
                  isPrimary
                    ? "bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] text-white shadow-[var(--ds-shadow-sm)]"
                    : "text-[var(--ds-color-neutral-700)] hover:bg-[var(--ds-color-neutral-50)] hover:text-[var(--ds-color-neutral-950)]",
                  isActive &&
                    !isPrimary &&
                    "border border-[var(--ds-border-subtle)] bg-[var(--ds-color-neutral-50)] text-[var(--ds-color-neutral-950)]"
                )}
              >
                <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--ds-border-subtle)] px-4 py-4">
          {!collapsed ? (
            <div className="rounded-[24px] bg-[var(--ds-color-neutral-0)] p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  alt="Preview User"
                  fallback="PU"
                  ring
                  size="sm"
                  status="online"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--ds-color-primary-900)]">
                    @preview-user
                  </p>
                  <p className="text-xs text-[var(--ds-color-neutral-500)]">
                    shell preview account
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--ds-color-neutral-600)]">
                공통 기반 단계에서는 셸 배치와 경로 인식을 먼저 고정합니다.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar alt="Preview User" fallback="PU" size="sm" ring />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
