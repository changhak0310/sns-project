"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "@/lib/session/session-provider";
import type { LogoutState, UseLogoutReturn } from "@/types/auth";

import { logoutService } from "../services/logout-service";

const initialLogoutState: LogoutState = {
  actionError: "",
  isLoading: false,
};

export function useLogout(): UseLogoutReturn {
  const [state, setState] = useState<LogoutState>(initialLogoutState);
  const submitLockRef = useRef(false);
  const router = useRouter();
  const { sessionUser, clearSessionUser } = useSession();

  async function logout() {
    if (!sessionUser || submitLockRef.current) {
      return;
    }

    submitLockRef.current = true;

    setState({
      actionError: "",
      isLoading: true,
    });

    try {
      const result = await logoutService.logout();

      if (result.success) {
        setState({
          actionError: "",
          isLoading: false,
        });
        clearSessionUser();
        router.replace("/login");

        return;
      }

      setState({
        actionError: result.message,
        isLoading: false,
      });
    } finally {
      submitLockRef.current = false;
    }
  }

  return {
    ...state,
    sessionUser,
    logout,
  };
}
