import Link from "next/link";
import {
  Clapperboard,
  Compass,
  Grid2X2,
  Heart,
  MessageCircleMore,
  MoonStar,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
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
  collapsed,
  sessionUser,
  accountActionArea,
  onToggleCollapse,
  shellTheme,
  onToggleTheme,
}: DesktopSidebarProps) {
  const homeItem = navItems.find((item) => item.href === "/");
  const createItem = navItems.find((item) => item.href === "/create");
  const profileItem = navItems.find(
    (item) => item.href.startsWith("/u/") || item.href === "/login"
  );
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
  const avatarFallback = sessionUser
    ? sessionUser.username.slice(0, 2).toUpperCase()
    : "GU";
  const nextTheme = shellTheme === "dark" ? "light" : "dark";
  const ThemeIcon = shellTheme === "dark" ? SunMedium : MoonStar;

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col",
        collapsed ? "lg:w-[92px]" : "lg:w-[248px]"
      )}
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col px-3 py-6">
        <div className="mb-8 flex items-center justify-between gap-2">
          <Link
            href="/"
            className={cn(
              "flex min-w-0 items-center gap-3 rounded-[24px] px-3 py-3 text-[var(--ds-shell-text)]",
              collapsed && "justify-center"
            )}
          >
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[18px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] font-display text-xl tracking-[-0.06em]">
              O
            </span>
            {!collapsed ? (
              <span className="truncate font-display text-3xl leading-none tracking-[-0.06em]">
                Orbit
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

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
                  collapsed && "justify-center px-0",
                  isActive && "bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)]"
                )}
              >
                <NavIcon name={item.icon} className="h-6 w-6 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}

          {utilityItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "flex min-h-14 items-center gap-4 rounded-[20px] px-4 py-3 text-left text-[15px] font-semibold text-[var(--ds-shell-text-muted)] transition duration-200 hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-6 w-6 shrink-0" aria-hidden />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
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
                  collapsed && "justify-center px-0",
                  isPrimary
                    ? "bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] text-white shadow-[0_14px_28px_rgba(239,109,71,0.24)] hover:brightness-105"
                    : "text-[var(--ds-shell-text-muted)] hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]",
                  isActive && !isPrimary && "bg-[var(--ds-shell-highlight)] text-[var(--ds-shell-text)]"
                )}
              >
                <NavIcon name={item.icon} className="h-6 w-6 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
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
                className={cn(
                  "flex min-h-12 items-center gap-4 rounded-[18px] px-4 py-3 text-left text-sm font-medium text-[var(--ds-shell-text-muted)] transition duration-200 hover:bg-[var(--ds-shell-highlight)] hover:text-[var(--ds-shell-text)]",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </button>
            );
          })}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={shellTheme === "dark"}
            aria-label={`Switch to ${nextTheme} mode`}
            className={cn(
              "mt-2 flex min-h-12 items-center gap-4 rounded-[18px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)]",
              collapsed && "justify-center px-0"
            )}
          >
            <ThemeIcon className="h-5 w-5 shrink-0" aria-hidden />
            {!collapsed ? (
              <span className="min-w-0 flex flex-1 items-center justify-between gap-3">
                <span>Theme</span>
                <span className="rounded-full border border-[var(--ds-shell-border)] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--ds-shell-text-muted)]">
                  {shellTheme}
                </span>
              </span>
            ) : null}
          </button>
        </div>

        <div className="mt-5">
          <div className="rounded-[24px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] p-4">
            <div
              className={cn(
                "flex items-center gap-3",
                collapsed && "justify-center"
              )}
            >
              <Avatar
                alt={sessionUser?.name ?? "Guest"}
                fallback={avatarFallback}
                size="sm"
                ring
                status={sessionUser ? "online" : undefined}
              />
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--ds-shell-text)]">
                    {sessionUser ? `@${sessionUser.username}` : "Login required"}
                  </p>
                  <p className="truncate text-xs text-[var(--ds-shell-text-muted)]">
                    {sessionUser ? sessionUser.email : "Auth actions stay pinned here."}
                  </p>
                </div>
              ) : null}
            </div>

            {!collapsed && accountActionArea ? (
              <div className="mt-4">{accountActionArea}</div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
