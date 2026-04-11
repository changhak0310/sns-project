import type { NavItem, ShellLayoutConfig } from "@/types/app-shell";

const AUTH_ROUTES = new Set(["/login", "/signup"]);
const MAIN_NAV_ROUTES = new Set(["/", "/create"]);
const PROFILE_ROOT_ROUTE_PATTERN = /^\/u\/[^/]+$/;

function buildProfileHref(username?: string) {
  return username ? `/u/${username}` : "/";
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.has(pathname);
}

function isProfileRootRoute(pathname: string) {
  return PROFILE_ROOT_ROUTE_PATTERN.test(pathname);
}

function isMainShellRoute(pathname: string) {
  return MAIN_NAV_ROUTES.has(pathname) || isProfileRootRoute(pathname);
}

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export const shellService = {
  getShellLayoutConfig(pathname: string): ShellLayoutConfig {
    if (isAuthRoute(pathname)) {
      return {
        showHeader: false,
        showMobileNav: false,
        showDesktopSidebar: false,
        showBackButton: false,
        showMenuButton: false,
      };
    }

    return {
      showHeader: true,
      showMobileNav: true,
      showDesktopSidebar: true,
      showBackButton: !isMainShellRoute(pathname),
      showMenuButton: true,
    };
  },

  getNavItems(username?: string): NavItem[] {
    return [
      {
        label: "Home",
        href: "/",
        icon: "home",
      },
      {
        label: "Create",
        href: "/create",
        icon: "plus-square",
        matchPrefixes: ["/create"],
      },
      {
        label: "Profile",
        href: buildProfileHref(username),
        icon: "user-round",
        matchPrefixes: username ? [`/u/${username}`] : undefined,
      },
    ];
  },

  getActiveNavHref(pathname: string, navItems: NavItem[]) {
    if (pathname === "/") {
      return "/";
    }

    const matchedItem = navItems.find(
      (item) =>
        pathname === item.href ||
        item.matchPrefixes?.some((prefix) => matchesPrefix(pathname, prefix))
    );

    return matchedItem?.href ?? "";
  },
};
