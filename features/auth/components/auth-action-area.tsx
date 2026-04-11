"use client";

import type { AuthActionAreaProps } from "@/types/auth";

import { useLogout } from "../hooks/use-logout";
import { LoginLinkButton } from "./login-link-button";
import { LogoutButton } from "./logout-button";
import { LogoutErrorMessage } from "./logout-error-message";
import { ProfileLinkButton } from "./profile-link-button";

export function AuthActionArea({
  loginHref,
  profileHref,
}: AuthActionAreaProps) {
  const { sessionUser, actionError, isLoading, logout } = useLogout();
  const resolvedProfileHref = sessionUser
    ? `/u/${sessionUser.username}`
    : profileHref;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {sessionUser ? (
          <>
            <ProfileLinkButton href={resolvedProfileHref} label="프로필" />
            <LogoutButton
              isLoading={isLoading}
              disabled={isLoading}
              onClick={() => {
                void logout();
              }}
            />
          </>
        ) : (
          <LoginLinkButton href={loginHref} label="로그인" />
        )}
      </div>
      {actionError ? <LogoutErrorMessage message={actionError} /> : null}
    </div>
  );
}
