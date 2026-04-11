"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import type { SessionUser } from "@/types/auth";

import { sessionReducer, type SessionState } from "./session-reducer";

type SessionContextValue = SessionState & {
  setSessionUser: (user: SessionUser | null) => void;
  clearSessionUser: () => void;
};

const PREVIEW_SESSION_USER: SessionUser = {
  id: 1,
  email: "orbit@example.com",
  username: "preview-user",
  name: "Orbit Preview",
};

const initialSessionState: SessionState = {
  sessionUser: PREVIEW_SESSION_USER,
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      setSessionUser(user) {
        dispatch({
          type: "set-session-user",
          payload: user,
        });
      },
      clearSessionUser() {
        dispatch({
          type: "clear-session-user",
        });
      },
    }),
    [state]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }

  return context;
}
