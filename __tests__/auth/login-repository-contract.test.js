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

function getLoginBlock(source) {
  const loginStart = source.indexOf("async login(");
  const signupStart = source.indexOf("async signup(");

  assert.notEqual(loginStart, -1, "authRepository.login() must exist");
  assert.notEqual(signupStart, -1, "authRepository.signup() must exist");

  return source.slice(loginStart, signupStart);
}

describe("login repository contract", () => {
  test("login posts to the login API endpoint", () => {
    const loginBlock = getLoginBlock(readAuthRepositorySource());

    assert.ok(
      loginBlock.includes('postAuthRequest<LoginApiResponse>("/api/auth/login"'),
      "authRepository.login() should call POST /api/auth/login"
    );
  });

  test("login forwards only email and password in the request body", () => {
    const loginBlock = getLoginBlock(readAuthRepositorySource());

    assert.match(
      loginBlock,
      /email,\s*password/s,
      "authRepository.login() should include email and password in the request body"
    );
    assert.ok(
      !loginBlock.includes("username"),
      "authRepository.login() must not forward username to the repository request body"
    );
    assert.ok(
      !loginBlock.includes("confirmPassword"),
      "authRepository.login() must not forward confirmPassword to the repository request body"
    );
  });

  test("login keeps network failures mapped to the shared network error constant", () => {
    const source = readAuthRepositorySource();

    assert.ok(
      source.includes("NETWORK_ERROR_MESSAGE"),
      "auth-repository.ts should keep the shared network error constant"
    );
    assert.ok(
      source.includes("return createAuthFailureResponse<T>(NETWORK_ERROR_MESSAGE);"),
      "login/signup request helper should normalize fetch failures as network errors"
    );
  });
});
