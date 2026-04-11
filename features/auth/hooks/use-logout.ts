"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/session/session-provider";
import type { UseLogoutReturn } from "@/types/auth";

import { logoutService } from "../services/logout-service";

export function useLogout(): UseLogoutReturn {
  const router = useRouter();
  const { sessionUser, clearSessionUser } = useSession();
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    if (!sessionUser || isLoading) {
      return;
    }

    setIsLoading(true);
    setActionError("");

    const result = await logoutService.logout();

    if (result.success) {
      clearSessionUser();
      setIsLoading(false);
      setActionError("");
      router.replace("/login");
      return;
    }

    setActionError(result.message);
    setIsLoading(false);
  }

  return {
    sessionUser,
    actionError,
    isLoading,
    logout,
  };
}
