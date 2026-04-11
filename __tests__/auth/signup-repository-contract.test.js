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

function getSignupBlock(source) {
  const signupStart = source.indexOf("async signup(");
  const logoutStart = source.indexOf("async logout()");

  assert.notEqual(signupStart, -1, "authRepository.signup() must exist");
  assert.notEqual(logoutStart, -1, "authRepository.logout() must exist");

  return source.slice(signupStart, logoutStart);
}

describe("signup repository contract", () => {
  test("signup posts to the signup API endpoint", () => {
    const signupBlock = getSignupBlock(readAuthRepositorySource());

    assert.ok(
      signupBlock.includes('postAuthRequest<SignupApiResponse>("/api/auth/signup"'),
      "authRepository.signup() should call POST /api/auth/signup"
    );
  });

  test("signup forwards only username, email, and password in the request body", () => {
    const signupBlock = getSignupBlock(readAuthRepositorySource());

    assert.match(
      signupBlock,
      /username,\s*email,\s*password/s,
      "authRepository.signup() should include username, email, and password in the request body"
    );
    assert.ok(
      !signupBlock.includes("confirmPassword"),
      "authRepository.signup() must not forward confirmPassword to the repository request body"
    );
  });

  test("signup keeps network failures mapped to the shared network error constant", () => {
    const source = readAuthRepositorySource();

    assert.ok(
      source.includes("NETWORK_ERROR_MESSAGE"),
      "auth-repository.ts should keep the shared network error constant"
    );
    assert.ok(
      source.includes("return createAuthFailureResponse<T>(NETWORK_ERROR_MESSAGE);"),
      "signup/login request helper should normalize fetch failures as network errors"
    );
  });
});
