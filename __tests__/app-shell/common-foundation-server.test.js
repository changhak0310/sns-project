import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const APP_ROOT_PATH = resolve(REPO_ROOT, "app");
const ROOT_LAYOUT_PATH = resolve(REPO_ROOT, "app/layout.tsx");
const MAIN_ROUTE_LAYOUT_PATH = resolve(REPO_ROOT, "app/(main)/layout.tsx");
const SHELL_SERVICE_PATH = resolve(
  REPO_ROOT,
  "features/app-shell/services/shell-service.ts"
);

function readWorkspaceFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

function walkFiles(directoryPath) {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(entryPath);
    }

    return entryPath;
  });
}

function listRouteHandlerFiles() {
  return walkFiles(APP_ROOT_PATH).filter((filePath) => /route\.(ts|js)$/.test(filePath));
}

describe("common foundation server contract", () => {
  test("does not introduce a common foundation API route", () => {
    const commonFoundationRouteHandlers = listRouteHandlerFiles()
      .map((filePath) => relative(REPO_ROOT, filePath))
      .filter((filePath) => /(shell|app-shell|foundation|layout-config)/i.test(filePath));

    assert.deepEqual(
      commonFoundationRouteHandlers,
      [],
      `Common foundation should stay server-free, but found ${commonFoundationRouteHandlers.join(", ")}`
    );
  });

  test("keeps layouts free of request-bound server APIs", () => {
    const rootLayoutSource = readWorkspaceFile(ROOT_LAYOUT_PATH);
    const mainRouteLayoutSource = readWorkspaceFile(MAIN_ROUTE_LAYOUT_PATH);

    for (const [fileName, source] of [
      ["app/layout.tsx", rootLayoutSource],
      ["app/(main)/layout.tsx", mainRouteLayoutSource],
    ]) {
      assert.ok(
        !source.includes("next/headers"),
        `${fileName} must not depend on next/headers for common foundation`
      );
      assert.ok(
        !source.includes("cookies("),
        `${fileName} must not read cookies for common foundation`
      );
      assert.ok(
        !source.includes("headers("),
        `${fileName} must not read request headers for common foundation`
      );
      assert.ok(
        !source.includes("fetch("),
        `${fileName} must not fetch server data for common foundation`
      );
    }
  });

  test("main route layout stays a thin wrapper around MainLayout", () => {
    const mainRouteLayoutSource = readWorkspaceFile(MAIN_ROUTE_LAYOUT_PATH);

    assert.ok(
      mainRouteLayoutSource.includes('from "@/features/app-shell/components/main-layout"'),
      "app/(main)/layout.tsx should compose the client MainLayout directly"
    );
    assert.ok(
      mainRouteLayoutSource.includes("return <MainLayout"),
      "app/(main)/layout.tsx should delegate rendering to MainLayout"
    );
    assert.ok(
      !mainRouteLayoutSource.includes("async function"),
      "app/(main)/layout.tsx should not introduce async server work for common foundation"
    );
    assert.ok(
      !mainRouteLayoutSource.includes("await "),
      "app/(main)/layout.tsx should not await server data for common foundation"
    );
  });

  test("keeps shell service deterministic without server access", () => {
    const shellServiceSource = readWorkspaceFile(SHELL_SERVICE_PATH);

    assert.ok(
      !shellServiceSource.includes("fetch("),
      "shell-service.ts must not fetch server data for common foundation"
    );
    assert.ok(
      !shellServiceSource.includes("next/headers"),
      "shell-service.ts must not depend on next/headers for common foundation"
    );
    assert.ok(
      !shellServiceSource.includes("server-only"),
      "shell-service.ts must stay shared and must not be marked server-only"
    );
  });
});
