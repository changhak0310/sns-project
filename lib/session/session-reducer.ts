import type { SessionUser } from "@/types/auth";

export type SessionState = {
  sessionUser: SessionUser | null;
};

export type SessionAction =
  | {
      type: "set-session-user";
      payload: SessionUser | null;
    }
  | {
      type: "clear-session-user";
    };

export function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "set-session-user":
      return {
        ...state,
        sessionUser: action.payload,
      };
    case "clear-session-user":
      return {
        ...state,
        sessionUser: null,
      };
    default:
      return state;
  }
}
