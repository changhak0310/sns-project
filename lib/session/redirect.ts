export function resolveRedirectTo(
  redirectTo?: string | null | string[]
): string {
  const candidate = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo;

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/";
  }

  return candidate;
}

export function buildLoginRedirect(pathname: string, search = "") {
  const redirectTo = search ? `${pathname}${search}` : pathname;
  const params = new URLSearchParams({
    redirect: redirectTo,
  });

  return `/login?${params.toString()}`;
}

export function buildAuthRedirectHref(basePath: "/login" | "/signup", redirectTo: string) {
  if (redirectTo === "/") {
    return basePath;
  }

  const params = new URLSearchParams({
    redirect: redirectTo,
  });

  return `${basePath}?${params.toString()}`;
}
