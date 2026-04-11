"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Grid2X2, Home } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { ShellFrame } from "@/components/layout/shell-frame";
import { cn } from "@/lib/utils/cn";
import type { MainLayoutProps } from "@/types/app-shell";

import { useAppShell } from "../hooks/use-app-shell";

function getHeaderTitle(pathname: string) {
  if (pathname === "/") {
    return "Orbit";
  }

  if (pathname.startsWith("/create")) {
    return "새 게시물";
  }

  if (pathname.startsWith("/p/")) {
    return "게시물";
  }

  if (pathname.startsWith("/u/")) {
    return "프로필";
  }

  if (pathname.startsWith("/design-system")) {
    return "디자인 시스템";
  }

  return "Orbit";
}

export function MainLayout({
  children,
  modal,
  headerAuthAction,
  sidebarAuthAction,
}: MainLayoutProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const {
    isMobileNavOpen,
    isDesktopSidebarCollapsed,
    layoutConfig,
    navItems,
    activeHref,
    sessionUser,
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
      header={
        layoutConfig.showHeader ? (
          <AppHeader
            title={getHeaderTitle(pathname)}
            showBackButton={layoutConfig.showBackButton}
            showMenuButton={layoutConfig.showMenuButton}
            onBack={() => router.back()}
            onMenuClick={toggleMobileNav}
            rightAction={
              <div className="flex items-center justify-end gap-2">
                {headerAuthAction ? (
                  <div className="lg:hidden">{headerAuthAction}</div>
                ) : null}
                <Link
                  href={pathname.startsWith("/design-system") ? "/" : "/design-system"}
                  className={cn(
                    "hidden h-11 items-center gap-2 rounded-full border border-[var(--ds-border-subtle)] bg-[rgba(255,255,255,0.72)] px-3 text-sm font-semibold text-[var(--ds-color-primary-900)] transition duration-200 hover:border-[var(--ds-border-strong)] hover:bg-[var(--ds-color-neutral-0)] sm:inline-flex"
                  )}
                >
                  {pathname.startsWith("/design-system") ? (
                    <Home className="h-4 w-4" aria-hidden />
                  ) : (
                    <Grid2X2 className="h-4 w-4" aria-hidden />
                  )}
                  <span className="hidden sm:inline">
                    {pathname.startsWith("/design-system") ? "Home" : "System"}
                  </span>
                </Link>
              </div>
            }
          />
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
            collapsed={isDesktopSidebarCollapsed}
            navItems={navItems}
            sessionUser={sessionUser}
            accountActionArea={sidebarAuthAction}
            onToggleCollapse={toggleDesktopSidebar}
          />
        ) : undefined
      }
      modal={modal}
      onCloseMobileNav={closeMobileNav}
    >
      {children}
    </ShellFrame>
  );
}
