import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const SIGNUP_ROUTE_PATH = resolve(REPO_ROOT, "app/api/auth/signup/route.ts");
const AUTH_SERVER_REPOSITORY_PATH = resolve(
  REPO_ROOT,
  "lib/social-repository/auth-server-repository.ts"
);
const AUTH_USER_SEED_PATH = resolve(REPO_ROOT, "data/seed/auth-users.ts");

function readWorkspaceFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

describe("signup server contract", () => {
  test("adds the signup API route handler", () => {
    assert.ok(
      existsSync(SIGNUP_ROUTE_PATH),
      "Signup server implementation should add app/api/auth/signup/route.ts"
    );

    const routeSource = readWorkspaceFile(SIGNUP_ROUTE_PATH);

    assert.ok(
      routeSource.includes('export const runtime = "nodejs"'),
      "signup route should run on the Node.js runtime"
    );
    assert.ok(
      routeSource.includes("export async function POST"),
      "signup route should export a POST handler"
    );
    assert.ok(
      routeSource.includes("await request.json()"),
      "signup route should parse the JSON request body"
    );
  });

  test("handles duplicate username and email checks through the server repository", () => {
    const routeSource = readWorkspaceFile(SIGNUP_ROUTE_PATH);

    assert.ok(
      routeSource.includes("authServerRepository.findUserByUsername"),
      "signup route should check duplicate usernames through authServerRepository"
    );
    assert.ok(
      routeSource.includes("authServerRepository.findUserByEmail"),
      "signup route should check duplicate emails through authServerRepository"
    );
    assert.ok(
      routeSource.includes("USERNAME_TAKEN_MESSAGE"),
      "signup route should keep a dedicated duplicate username message"
    );
    assert.ok(
      routeSource.includes("EMAIL_TAKEN_MESSAGE"),
      "signup route should keep a dedicated duplicate email message"
    );
    assert.ok(
      routeSource.includes("authServerRepository.createUser"),
      "signup route should create the user through authServerRepository"
    );
  });

  test("keeps signup persistence behind a server-only repository", () => {
    assert.ok(
      existsSync(AUTH_SERVER_REPOSITORY_PATH),
      "Signup server implementation should add a server-side auth repository"
    );

    const repositorySource = readWorkspaceFile(AUTH_SERVER_REPOSITORY_PATH);

    assert.ok(
      repositorySource.includes('import "server-only"'),
      "auth-server-repository.ts must be server-only"
    );
    assert.ok(
      repositorySource.includes('from "bcryptjs"'),
      "auth-server-repository.ts should hash passwords with bcryptjs"
    );
    assert.ok(
      repositorySource.includes("AUTH_USER_SEED"),
      "auth-server-repository.ts should initialize from data/seed"
    );
    assert.ok(
      repositorySource.includes("async createUser"),
      "auth-server-repository.ts should expose user creation"
    );
  });

  test("stores auth seed data outside app and feature layers", () => {
    assert.ok(
      existsSync(AUTH_USER_SEED_PATH),
      "Signup server implementation should add data/seed/auth-users.ts"
    );

    const seedSource = readWorkspaceFile(AUTH_USER_SEED_PATH);

    assert.ok(
      seedSource.includes("export const AUTH_USER_SEED"),
      "auth user seed file should export AUTH_USER_SEED"
    );
  });
});
