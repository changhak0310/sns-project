import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const LOGOUT_ROUTE_PATH = resolve(REPO_ROOT, "app/api/auth/logout/route.ts");

function readWorkspaceFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

describe("logout server contract", () => {
  test("adds the logout API route handler", () => {
    assert.ok(
      existsSync(LOGOUT_ROUTE_PATH),
      "Logout server implementation should add app/api/auth/logout/route.ts"
    );

    const routeSource = readWorkspaceFile(LOGOUT_ROUTE_PATH);

    assert.ok(
      routeSource.includes('export const runtime = "nodejs"'),
      "logout route should run on the Node.js runtime"
    );
    assert.ok(
      routeSource.includes("export async function POST"),
      "logout route should export a POST handler"
    );
    assert.ok(
      routeSource.includes('from "next/headers"'),
      "logout route should read and mutate cookies through next/headers"
    );
  });

  test("clears the current auth session without parsing a request body", () => {
    const routeSource = readWorkspaceFile(LOGOUT_ROUTE_PATH);

    assert.ok(
      routeSource.includes("await cookies()"),
      "logout route should access the cookie store inside the handler"
    );
    assert.ok(
      routeSource.includes("cookieStore.delete(SESSION_COOKIE_NAME)"),
      "logout route should clear the auth session cookie"
    );
    assert.ok(
      !routeSource.includes("request.json()"),
      "logout route should not parse a request body"
    );
    assert.ok(
      routeSource.includes("success: true"),
      "logout route should keep the success response contract"
    );
  });

  test("keeps dedicated logout failure messages", () => {
    const routeSource = readWorkspaceFile(LOGOUT_ROUTE_PATH);

    assert.ok(
      routeSource.includes("LOGOUT_FAILURE_MESSAGE"),
      "logout route should keep the logout failure message from the spec"
    );
    assert.ok(
      routeSource.includes("SERVER_ERROR_MESSAGE"),
      "logout route should keep the server error message from the spec"
    );
    assert.ok(
      routeSource.includes("createFailureResponse"),
      "logout route should normalize failure responses"
    );
  });
});
