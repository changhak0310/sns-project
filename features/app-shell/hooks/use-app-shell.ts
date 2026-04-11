"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";

import { useSession } from "@/lib/session/session-provider";
import type { UseAppShellReturn } from "@/types/app-shell";

import { shellService } from "../services/shell-service";

export function useAppShell(): UseAppShellReturn {
  const pathname = usePathname() ?? "/";
  const { sessionUser } = useSession();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const openMobileNav = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen((current) => !current);
  }, []);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarCollapsed((current) => !current);
  }, []);

  const resetShellState = useCallback(() => {
    setIsMobileNavOpen(false);
    setIsDesktopSidebarCollapsed(false);
  }, []);

  const username = sessionUser?.username;
  const layoutConfig = shellService.getShellLayoutConfig(pathname);
  const navItems = shellService.getNavItems(username);
  const activeHref = shellService.getActiveNavHref(pathname, navItems);

  return {
    isMobileNavOpen,
    isDesktopSidebarCollapsed,
    layoutConfig,
    navItems,
    activeHref,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
    toggleDesktopSidebar,
    resetShellState,
  };
}
