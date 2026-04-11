import type { NavItem, ShellLayoutConfig } from "@/types/app-shell";

const AUTH_ROUTES = new Set(["/login", "/signup"]);

function buildProfileHref(username?: string) {
  return username ? `/u/${username}` : "/login";
}

export const shellService = {
  getShellLayoutConfig(pathname: string): ShellLayoutConfig {
    if (AUTH_ROUTES.has(pathname)) {
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
      showBackButton: pathname !== "/",
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
        item.matchPrefixes?.some((prefix) => pathname.startsWith(prefix))
    );

    return matchedItem?.href ?? "";
  },
};
