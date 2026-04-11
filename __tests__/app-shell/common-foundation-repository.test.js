import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const SHELL_SERVICE_PATH = resolve(
  REPO_ROOT,
  "features/app-shell/services/shell-service.ts"
);
const USE_APP_SHELL_PATH = resolve(
  REPO_ROOT,
  "features/app-shell/hooks/use-app-shell.ts"
);
const DISALLOWED_REPOSITORY_PATHS = [
  "lib/social-repository/shell-repository.ts",
  "lib/social-repository/app-shell-repository.ts",
].map((path) => resolve(REPO_ROOT, path));

function readWorkspaceFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

describe("common foundation repository contract", () => {
  test("does not introduce a dedicated shell repository module", () => {
    for (const repositoryPath of DISALLOWED_REPOSITORY_PATHS) {
      assert.ok(
        !existsSync(repositoryPath),
        `Common foundation should stay repository-free, but found ${repositoryPath}`
      );
    }
  });

  test("keeps shell service free of social-repository imports", () => {
    const shellServiceSource = readWorkspaceFile(SHELL_SERVICE_PATH);

    assert.ok(
      !shellServiceSource.includes("social-repository"),
      "shell-service.ts must not import from lib/social-repository for common foundation"
    );
  });

  test("derives shell state from pathname and session without repository access", () => {
    const useAppShellSource = readWorkspaceFile(USE_APP_SHELL_PATH);

    assert.ok(
      useAppShellSource.includes('from "@/lib/session/session-provider"'),
      "use-app-shell.ts should read session state directly from SessionProvider"
    );
    assert.ok(
      useAppShellSource.includes("usePathname"),
      "use-app-shell.ts should derive shell state from the current pathname"
    );
    assert.ok(
      !useAppShellSource.includes("social-repository"),
      "use-app-shell.ts must not call a repository for common foundation"
    );
  });
});
