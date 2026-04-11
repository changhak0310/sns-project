import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const AUTH_REPOSITORY_PATH = resolve(
  REPO_ROOT,
  "lib/social-repository/auth-repository.ts"
);

function readAuthRepositorySource() {
  return readFileSync(AUTH_REPOSITORY_PATH, "utf-8");
}

function getLogoutBlock(source) {
  const logoutStart = source.indexOf("async logout()");
  const objectEnd = source.lastIndexOf("};");

  assert.notEqual(logoutStart, -1, "authRepository.logout() must exist");
  assert.notEqual(objectEnd, -1, "authRepository export must end with an object close");

  return source.slice(logoutStart, objectEnd);
}

describe("logout repository contract", () => {
  test("logout posts to the logout API endpoint", () => {
    const logoutBlock = getLogoutBlock(readAuthRepositorySource());

    assert.ok(
      logoutBlock.includes('fetch("/api/auth/logout", {'),
      "authRepository.logout() should call POST /api/auth/logout"
    );
    assert.ok(
      logoutBlock.includes('method: "POST"'),
      'authRepository.logout() should use method: "POST"'
    );
  });

  test("logout does not send a request body", () => {
    const logoutBlock = getLogoutBlock(readAuthRepositorySource());

    assert.ok(
      !logoutBlock.includes("body:"),
      "authRepository.logout() must not send a request body"
    );
    assert.ok(
      !logoutBlock.includes('"Content-Type": "application/json"'),
      "authRepository.logout() must not send JSON headers when no body is required"
    );
  });

  test("logout keeps network failures mapped to the shared network error constant", () => {
    const logoutBlock = getLogoutBlock(readAuthRepositorySource());

    assert.ok(
      logoutBlock.includes("createLogoutFailureResponse(NETWORK_ERROR_MESSAGE)"),
      "authRepository.logout() should normalize fetch failures as network errors"
    );
  });
});
