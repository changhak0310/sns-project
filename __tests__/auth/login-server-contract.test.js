import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const LOGIN_ROUTE_PATH = resolve(REPO_ROOT, "app/api/auth/login/route.ts");
const AUTH_SERVER_REPOSITORY_PATH = resolve(
  REPO_ROOT,
  "lib/social-repository/auth-server-repository.ts"
);

function readWorkspaceFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

describe("login server contract", () => {
  test("adds the login API route handler", () => {
    assert.ok(
      existsSync(LOGIN_ROUTE_PATH),
      "Login server implementation should add app/api/auth/login/route.ts"
    );

    const routeSource = readWorkspaceFile(LOGIN_ROUTE_PATH);

    assert.ok(
      routeSource.includes('export const runtime = "nodejs"'),
      "login route should run on the Node.js runtime"
    );
    assert.ok(
      routeSource.includes("export async function POST"),
      "login route should export a POST handler"
    );
    assert.ok(
      routeSource.includes("await request.json()"),
      "login route should parse the JSON request body"
    );
  });

  test("validates the login body and checks credentials through the server repository", () => {
    const routeSource = readWorkspaceFile(LOGIN_ROUTE_PATH);

    assert.ok(
      routeSource.includes("getEmailValidationMessage"),
      "login route should validate the email format on the server"
    );
    assert.ok(
      routeSource.includes("getPasswordValidationMessage"),
      "login route should validate password presence on the server"
    );
    assert.ok(
      routeSource.includes("authServerRepository.verifyUserCredentials"),
      "login route should check credentials through authServerRepository"
    );
    assert.ok(
      routeSource.includes("INVALID_CREDENTIALS_MESSAGE"),
      "login route should keep the invalid credentials failure message"
    );
  });

  test("keeps password verification inside the server-only auth repository", () => {
    const repositorySource = readWorkspaceFile(AUTH_SERVER_REPOSITORY_PATH);

    assert.ok(
      repositorySource.includes('import "server-only"'),
      "auth-server-repository.ts must remain server-only"
    );
    assert.ok(
      repositorySource.includes('import { compare, hash } from "bcryptjs"'),
      "auth-server-repository.ts should verify passwords with bcryptjs compare"
    );
    assert.ok(
      repositorySource.includes("async verifyUserCredentials"),
      "auth-server-repository.ts should expose credential verification"
    );
    assert.ok(
      repositorySource.includes("await compare(password, user.passwordHash)"),
      "auth-server-repository.ts should compare the login password against the stored hash"
    );
  });
});
