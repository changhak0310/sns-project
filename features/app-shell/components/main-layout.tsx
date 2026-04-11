"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { ShellFrame } from "@/components/layout/shell-frame";
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

  return "Orbit";
}

export function MainLayout({ children, modal }: MainLayoutProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const {
    isMobileNavOpen,
    isDesktopSidebarCollapsed,
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
      header={
        layoutConfig.showHeader ? (
          <AppHeader
            title={getHeaderTitle(pathname)}
            showBackButton={layoutConfig.showBackButton}
            showMenuButton={layoutConfig.showMenuButton}
            onBack={() => router.back()}
            onMenuClick={toggleMobileNav}
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
