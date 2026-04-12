import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/session/auth-session";
import type { SessionUser } from "@/types/auth";
import type { ApiError, ApiSuccess } from "@/types/api";

export class ApiRouteError extends Error {
  status: number;
  details?: Record<string, string>;

  constructor(
    message: string,
    status = 400,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiRouteError";
    this.status = status;
    this.details = details;
  }
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function apiError(
  message: string,
  status = 400,
  details?: Record<string, string>
) {
  return NextResponse.json<ApiError>(
    {
      success: false,
      message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiRouteError) {
    return apiError(error.message, error.status, error.details);
  }

  return apiError("Internal server error.", 500);
}

export async function readJsonBody<T>(request: Request) {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiRouteError("Invalid request body.", 400);
  }
}

export async function requireSessionUser() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    throw new ApiRouteError("Authentication required.", 401);
  }

  return sessionUser;
}

export async function getOptionalSessionUser(): Promise<SessionUser | null> {
  return getSessionUser();
}

export function getQueryParam(
  searchParams: URLSearchParams,
  key: string
): string | null {
  const value = searchParams.get(key);

  return value === null || value.trim() === "" ? null : value.trim();
}

export function getNumberParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
  options: {
    min?: number;
    max?: number;
  } = {}
) {
  const rawValue = searchParams.get(key);
  const parsed = rawValue ? Number(rawValue) : fallback;

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const min = options.min ?? Number.MIN_SAFE_INTEGER;
  const max = options.max ?? Number.MAX_SAFE_INTEGER;

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}
