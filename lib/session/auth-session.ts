import "server-only";

import { cookies } from "next/headers";

import type { SessionUser } from "@/types/auth";

const AUTH_SESSION_COOKIE = "sns-auth-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SessionUser>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.email === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.avatarUrl === "string"
  );
}

function encodeSessionUser(sessionUser: SessionUser) {
  return Buffer.from(JSON.stringify(sessionUser), "utf8").toString("base64url");
}

function decodeSessionUser(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    ) as unknown;

    return isSessionUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();

  return decodeSessionUser(cookieStore.get(AUTH_SESSION_COOKIE)?.value);
}

export async function setSessionUser(sessionUser: SessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_SESSION_COOKIE,
    encodeSessionUser(sessionUser),
    SESSION_COOKIE_OPTIONS
  );
}

export async function clearSessionUser() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_SESSION_COOKIE, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
}
