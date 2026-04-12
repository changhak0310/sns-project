"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Grid2X2, Home, PlusSquare, UserRound } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { ShellFrame } from "@/components/layout/shell-frame";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import type { MainLayoutProps } from "@/types/app-shell";

import { useAppShell } from "../hooks/use-app-shell";
import { useShellTheme } from "../hooks/use-shell-theme";

function getHeaderTitle(pathname: string) {
  if (pathname === "/") {
    return "Feed";
  }

  if (pathname.startsWith("/create")) {
    return "Create";
  }

  if (pathname.startsWith("/p/")) {
    return "Post";
  }

  if (pathname.startsWith("/u/")) {
    return "Profile";
  }

  if (pathname.startsWith("/design-system")) {
    return "Design";
  }

  return "Orbit";
}

function shouldShowDesktopRail(pathname: string) {
  return pathname === "/";
}

function DesktopAccountRail() {
  return (
    <aside className="hidden xl:flex xl:w-[320px] xl:flex-col">
      <div className="sticky top-8 space-y-4">
        <section className="rounded-[28px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] p-5 shadow-[0_28px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar alt="Preview User" fallback="PU" size="md" ring status="online" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--ds-shell-text)]">
                  @preview-user
                </p>
                <p className="truncate text-sm text-[var(--ds-shell-text-muted)]">
                  Orbit creator
                </p>
              </div>
            </div>
            <span className="rounded-full border border-[var(--ds-shell-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ds-shell-text-muted)]">
              Live
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/u/preview-user"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] px-4 text-sm font-semibold text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)]"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              <span>Profile</span>
            </Link>
            <Link
              href="/create"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--ds-color-accent-400),var(--ds-color-accent-500))] px-4 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(239,109,71,0.24)] transition duration-200 hover:brightness-105"
            >
              <PlusSquare className="h-4 w-4" aria-hidden />
              <span>Create</span>
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-[var(--ds-shell-border)] bg-[var(--ds-shell-surface)] p-5 shadow-[0_22px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ds-shell-text-muted)]">
            Layout Notes
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--ds-shell-text-muted)]">
            <p>Desktop keeps a fixed left rail, a centered feed column, and a quiet account rail.</p>
            <p>Sub routes collapse back toward the center so detail screens still feel focused.</p>
          </div>
          <Link
            href="/design-system"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--ds-shell-border)] px-4 text-sm font-semibold text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)]"
          >
            <Grid2X2 className="h-4 w-4" aria-hidden />
            <span>Open System</span>
          </Link>
        </section>
      </div>
    </aside>
  );
}

export function MainLayout({ children, modal }: MainLayoutProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const showDesktopRail = shouldShowDesktopRail(pathname);
  const { theme, toggleTheme } = useShellTheme();
  const {
    isMobileNavOpen,
    layoutConfig,
    navItems,
    activeHref,
    closeMobileNav,
    toggleMobileNav,
    toggleDesktopSidebar,
    resetShellState,
  } = useAppShell();

  useEffect(() => {
    closeMobileNav();
  }, [closeMobileNav, pathname]);

  useEffect(() => {
    return () => {
      resetShellState();
    };
  }, [resetShellState]);

  return (
    <ShellFrame
      shellTheme={theme}
      header={
        layoutConfig.showHeader ? (
          <div className="lg:hidden">
            <AppHeader
              title={getHeaderTitle(pathname)}
              showBackButton={layoutConfig.showBackButton}
              showMenuButton={layoutConfig.showMenuButton}
              onBack={() => router.back()}
              onMenuClick={toggleMobileNav}
              rightAction={
                <Link
                  href={pathname.startsWith("/design-system") ? "/" : "/design-system"}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border border-[var(--ds-shell-border)] bg-[var(--ds-shell-highlight)] px-3 text-sm font-semibold text-[var(--ds-shell-text)] transition duration-200 hover:border-[var(--ds-shell-border-strong)] hover:bg-[var(--ds-shell-hover)]"
                  )}
                >
                  {pathname.startsWith("/design-system") ? (
                    <Home className="h-4 w-4" aria-hidden />
                  ) : (
                    <Grid2X2 className="h-4 w-4" aria-hidden />
                  )}
                  <span className="hidden sm:inline">
                    {pathname.startsWith("/design-system") ? "Feed" : "System"}
                  </span>
                </Link>
              }
            />
          </div>
        ) : undefined
      }
      mobileNav={
        layoutConfig.showMobileNav && isMobileNavOpen ? (
          <BottomNav activeHref={activeHref} navItems={navItems} />
        ) : undefined
      }
      desktopSidebar={
        layoutConfig.showDesktopSidebar ? (
          <DesktopSidebar
            activeHref={activeHref}
            collapsed={false}
            navItems={navItems}
            onToggleCollapse={toggleDesktopSidebar}
            onToggleTheme={toggleTheme}
            shellTheme={theme}
          />
        ) : undefined
      }
      modal={modal}
      onCloseMobileNav={closeMobileNav}
    >
      <div
        data-ui-theme={theme}
        className={cn(
          "mx-auto flex w-full max-w-[1480px] items-start justify-center gap-6 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-8 xl:gap-12",
          showDesktopRail && "xl:justify-between"
        )}
      >
        <div
          className={cn(
            "min-w-0 w-full",
            showDesktopRail ? "mx-auto max-w-[680px]" : "mx-auto max-w-[980px]"
          )}
        >
          {children}
        </div>
        {showDesktopRail ? <DesktopAccountRail /> : null}
      </div>
    </ShellFrame>
  );
}
