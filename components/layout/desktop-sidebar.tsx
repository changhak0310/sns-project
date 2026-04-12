import Link from "next/link";
import {
  Clapperboard,
  Compass,
  Grid2X2,
  Heart,
  MessageCircleMore,
  MoonStar,
  MoreHorizontal,
  Search,
  SunMedium,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import type { DesktopSidebarProps } from "@/types/app-shell";

import { NavIcon } from "./nav-icon";

export function DesktopSidebar({
  navItems,
  activeHref,
  shellTheme,
  onToggleTheme,
}: DesktopSidebarProps) {
  const homeItem = navItems.find((item) => item.href === "/");
  const createItem = navItems.find((item) => item.href === "/create");
  const profileItem = navItems.find((item) => item.href.startsWith("/u/"));
  const primaryItems = [homeItem, createItem, profileItem].filter(
    (item): item is NonNullable<typeof item> => Boolean(item)
  );
  const utilityItems = [
    { label: "Reels", icon: Clapperboard },
    { label: "Messages", icon: MessageCircleMore },
    { label: "Search", icon: Search },
    { label: "Explore", icon: Compass },
    { label: "Alerts", icon: Heart },
  ];
  const footerItems = [
    { label: "More", icon: MoreHorizontal },
    { label: "Meta Apps", icon: Grid2X2 },
  ];
  const nextTheme = shellTheme === "dark" ? "light" : "dark";
  const ThemeIcon = shellTheme === "dark" ? SunMedium : MoonStar;

  return (
    <aside className="hidden lg:flex lg:w-[92px] xl:w-[248px] lg:flex-col">
      <div className="sticky top-0 flex min-h-screen w-full flex-col px-3 py-6">
        <Link
          href="/"
          className="mb-8 flex items-center gap-3 rounded-[24px] px-3 py-3 text-[var(--ds-shell-text)]"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-[18px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] font-display text-xl tracking-[-0.06em]">
            O
          </span>
          <span className="hidden font-display text-3xl leading-none tracking-[-0.06em] xl:inline">
            Orbit
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-2">
          {primaryItems.slice(0, 1).map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-14 items-center gap-4 rounded-[20px] px-4 py-3 text-[15px] font-semibold text-[var(--ds-shell-text-muted)] transition duration-200 hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]",
                  isActive && "bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)]"
                )}
              >
                <NavIcon name={item.icon} className="h-6 w-6 shrink-0" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}

          {utilityItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className="flex min-h-14 items-center gap-4 rounded-[20px] px-4 py-3 text-left text-[15px] font-semibold text-[var(--ds-shell-text-muted)] transition duration-200 hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]"
              >
                <Icon className="h-6 w-6 shrink-0" aria-hidden />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}

          {primaryItems.slice(1).map((item) => {
            const isActive = item.href === activeHref;
            const isPrimary = item.href === "/create";

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-14 items-center gap-4 rounded-[20px] px-4 py-3 text-[15px] font-semibold transition duration-200",
                  isPrimary
                    ? "bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] text-white shadow-[0_14px_28px_rgba(239,109,71,0.24)] hover:brightness-105"
                    : "text-[var(--ds-shell-text-muted)] hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]",
                  isActive && !isPrimary && "bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)]"
                )}
              >
                <NavIcon name={item.icon} className="h-6 w-6 shrink-0" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 pt-4">
          {footerItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className="flex min-h-12 items-center gap-4 rounded-[18px] px-4 py-3 text-left text-sm font-medium text-[var(--ds-shell-text-muted)] transition duration-200 hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]"
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={shellTheme === "dark"}
            aria-label={`Switch to ${nextTheme} mode`}
            className="mt-2 flex min-h-12 items-center gap-4 rounded-[18px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)] lg:justify-center xl:justify-start"
          >
            <ThemeIcon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="hidden min-w-0 flex-1 items-center justify-between gap-3 xl:flex">
              <span>Theme</span>
              <span className="rounded-full border border-[var(--ds-shell-border)] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--ds-shell-text-muted)]">
                {shellTheme}
              </span>
            </span>
          </button>
        </div>

        <div className="mt-5 hidden xl:block">
          <div className="rounded-[24px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] p-4">
            <div className="flex items-center gap-3">
              <Avatar alt="Preview User" fallback="PU" size="sm" ring status="online" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--ds-shell-text)]">
                  @preview-user
                </p>
                <p className="text-xs text-[var(--ds-shell-text-muted)]">
                  shell preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
