import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  matchPrefixes?: string[];
};

export type ShellTheme = "dark" | "light";

export type ShellLayoutConfig = {
  showHeader: boolean;
  showMobileNav: boolean;
  showDesktopSidebar: boolean;
  showBackButton: boolean;
  showMenuButton: boolean;
};

export type LayoutChildrenProps = {
  children: ReactNode;
};

export type MainLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export type ShellFrameProps = {
  children: ReactNode;
  header?: ReactNode;
  mobileNav?: ReactNode;
  desktopSidebar?: ReactNode;
  modal?: ReactNode;
  shellTheme?: ShellTheme;
  onCloseMobileNav?: () => void;
};

export type AppHeaderProps = {
  title: string;
  showBackButton: boolean;
  showMenuButton: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
  rightAction?: ReactNode;
};

export type BottomNavProps = {
  navItems: NavItem[];
  activeHref: string;
};

export type DesktopSidebarProps = {
  navItems: NavItem[];
  activeHref: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  shellTheme: ShellTheme;
  onToggleTheme: () => void;
};

export type AppShellState = {
  isMobileNavOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
};

export type AppShellComputed = {
  layoutConfig: ShellLayoutConfig;
  navItems: NavItem[];
  activeHref: string;
};

export type AppShellActions = {
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  toggleDesktopSidebar: () => void;
  resetShellState: () => void;
};

export type UseAppShellReturn = AppShellState &
  AppShellComputed &
  AppShellActions;
