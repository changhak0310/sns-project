/**
 * Tests for the PR: docs/plan/function file rename and link update
 *
 * Covered changes:
 * - login-state-management-guid.md renamed to management-guid.md
 * - function-md-guide.md updated link from login-state-management-guid.md
 *   to management-guid.md
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const FUNCTION_DIR = resolve(REPO_ROOT, "docs/plan/function");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readDoc(relPath) {
  return readFileSync(resolve(FUNCTION_DIR, relPath), "utf-8");
}

// ---------------------------------------------------------------------------
// File existence: rename outcome
// ---------------------------------------------------------------------------

describe("management-guid.md file rename", () => {
  test("management-guid.md exists at the expected path", () => {
    const filePath = resolve(FUNCTION_DIR, "management-guid.md");
    assert.ok(
      existsSync(filePath),
      `Expected management-guid.md to exist at ${filePath}`
    );
  });

  test("old filename login-state-management-guid.md no longer exists", () => {
    const oldPath = resolve(FUNCTION_DIR, "login-state-management-guid.md");
    assert.ok(
      !existsSync(oldPath),
      `Expected login-state-management-guid.md to have been renamed/removed, but it still exists at ${oldPath}`
    );
  });

  test("management-guid.md is non-empty", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.trim().length > 0,
      "management-guid.md should not be empty"
    );
  });

  test("management-guid.md starts with a top-level heading", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.trimStart().startsWith("# "),
      "management-guid.md should begin with a top-level markdown heading (# ...)"
    );
  });

  test("management-guid.md contains the expected login state management heading", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.includes("로그인 상태 관리"),
      "management-guid.md should contain '로그인 상태 관리'"
    );
  });
});

// ---------------------------------------------------------------------------
// function-md-guide.md link update
// ---------------------------------------------------------------------------

describe("function-md-guide.md reference link update", () => {
  test("function-md-guide.md exists", () => {
    const filePath = resolve(FUNCTION_DIR, "function-md-guide.md");
    assert.ok(
      existsSync(filePath),
      `Expected function-md-guide.md to exist at ${filePath}`
    );
  });

  test("function-md-guide.md references management-guid.md (updated link)", () => {
    const content = readDoc("function-md-guide.md");
    assert.ok(
      content.includes("management-guid.md"),
      "function-md-guide.md should reference the renamed file management-guid.md"
    );
  });

  test("function-md-guide.md does not reference the old login-state-management-guid.md (regression)", () => {
    const content = readDoc("function-md-guide.md");
    assert.ok(
      !content.includes("login-state-management-guid.md"),
      "function-md-guide.md must not contain a stale reference to login-state-management-guid.md"
    );
  });

  test("function-md-guide.md has a markdown link pointing to ./management-guid.md", () => {
    const content = readDoc("function-md-guide.md");
    // Matches [<any text>](./management-guid.md)
    const linkPattern = /\[.*?\]\(\.\/management-guid\.md\)/;
    assert.ok(
      linkPattern.test(content),
      "function-md-guide.md should contain a relative markdown link [...](.\/management-guid.md)"
    );
  });

  test("function-md-guide.md link text identifies management-guid.md as the reference document", () => {
    const content = readDoc("function-md-guide.md");
    // The link text should be the filename itself as per the guide convention
    assert.ok(
      content.includes("[management-guid.md](./management-guid.md)"),
      "function-md-guide.md should include the link [management-guid.md](./management-guid.md)"
    );
  });
});

// ---------------------------------------------------------------------------
// Cross-check: content parity (rename must preserve content)
// ---------------------------------------------------------------------------

describe("management-guid.md content integrity after rename", () => {
  test("management-guid.md contains the LoginState type definition", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.includes("LoginState"),
      "management-guid.md should contain the LoginState type definition"
    );
  });

  test("management-guid.md contains the loginService section", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.includes("loginService"),
      "management-guid.md should contain the loginService specification"
    );
  });

  test("management-guid.md contains the authRepository section", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.includes("authRepository"),
      "management-guid.md should contain the authRepository specification"
    );
  });

  test("management-guid.md references design system documents", () => {
    const content = readDoc("management-guid.md");
    assert.ok(
      content.includes("design-system.md"),
      "management-guid.md should reference design-system.md"
    );
  });

  // Boundary / negative case: file should not accidentally be a redirect or stub
  test("management-guid.md has substantial content (more than 100 lines)", () => {
    const content = readDoc("management-guid.md");
    const lineCount = content.split("\n").length;
    assert.ok(
      lineCount > 100,
      `management-guid.md should have more than 100 lines (got ${lineCount})`
    );
  });
});