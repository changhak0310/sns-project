import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test } from "node:test";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const CREATE_ROUTE_PATH = resolve(REPO_ROOT, "app/(main)/create/page.tsx");
const TYPES_PATH = resolve(REPO_ROOT, "types/post-management.ts");
const SEED_PATH = resolve(REPO_ROOT, "data/seed/posts.ts");
const FEATURE_COMPONENTS_DIR = resolve(
  REPO_ROOT,
  "features/post-management/components"
);
const POST_COMPOSER_FORM_PATH = resolve(
  FEATURE_COMPONENTS_DIR,
  "post-composer-form.tsx"
);
const POST_ACTION_MENU_PATH = resolve(
  FEATURE_COMPONENTS_DIR,
  "post-action-menu.tsx"
);
const CREATE_PAGE_COMPONENT_PATH = resolve(
  FEATURE_COMPONENTS_DIR,
  "create-post-page.tsx"
);
const EDIT_PAGE_COMPONENT_PATH = resolve(
  FEATURE_COMPONENTS_DIR,
  "edit-post-page.tsx"
);

function readWorkspaceFile(filePath) {
  return readFileSync(filePath, "utf-8");
}

describe("post management components contract", () => {
  test("adds the post-management types, seed, and component files", () => {
    const requiredFiles = [
      TYPES_PATH,
      SEED_PATH,
      CREATE_PAGE_COMPONENT_PATH,
      EDIT_PAGE_COMPONENT_PATH,
      POST_COMPOSER_FORM_PATH,
      resolve(FEATURE_COMPONENTS_DIR, "post-image-picker.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "caption-input.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "post-preview.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "create-post-submit-button.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "edit-post-submit-button.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "post-card.tsx"),
      POST_ACTION_MENU_PATH,
      resolve(FEATURE_COMPONENTS_DIR, "edit-post-link-button.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "delete-post-button.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "post-form-error-message.tsx"),
      resolve(FEATURE_COMPONENTS_DIR, "post-action-error-message.tsx"),
    ];

    for (const filePath of requiredFiles) {
      assert.ok(existsSync(filePath), `${filePath} should exist`);
    }
  });

  test("wires the /create route to the new CreatePostPage component", () => {
    const routeSource = readWorkspaceFile(CREATE_ROUTE_PATH);

    assert.ok(
      routeSource.includes("CreatePostPage"),
      "create route should render the CreatePostPage component"
    );
  });

  test("keeps the composer form composed from picker, caption, preview, and mode-specific submit buttons", () => {
    const composerSource = readWorkspaceFile(POST_COMPOSER_FORM_PATH);

    assert.ok(
      composerSource.includes("PostImagePicker"),
      "post composer form should include PostImagePicker"
    );
    assert.ok(
      composerSource.includes("CaptionInput"),
      "post composer form should include CaptionInput"
    );
    assert.ok(
      composerSource.includes("PostPreview"),
      "post composer form should include PostPreview"
    );
    assert.ok(
      composerSource.includes("CreatePostSubmitButton"),
      "post composer form should keep the create submit button"
    );
    assert.ok(
      composerSource.includes("EditPostSubmitButton"),
      "post composer form should keep the edit submit button"
    );
    assert.ok(
      composerSource.includes("mode === \"create\""),
      "post composer form should branch between create and edit mode"
    );
  });

  test("keeps the action menu grouped around edit and delete actions", () => {
    const actionMenuSource = readWorkspaceFile(POST_ACTION_MENU_PATH);

    assert.ok(
      actionMenuSource.includes("EditPostLinkButton"),
      "post action menu should expose an edit link button"
    );
    assert.ok(
      actionMenuSource.includes("DeletePostButton"),
      "post action menu should expose a delete button"
    );
    assert.ok(
      actionMenuSource.includes("setIsActionMenuOpen"),
      "post action menu should manage its own open state"
    );
    assert.ok(
      actionMenuSource.includes("PostActionErrorMessage"),
      "post action menu should show inline action errors"
    );
  });
});
