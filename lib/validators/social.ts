const MAX_CAPTION_LENGTH = 300;
const MAX_COMMENT_LENGTH = 300;
const MAX_BIO_LENGTH = 160;
const MAX_TAGS = 5;

export function getCaptionValidationMessage(caption: string) {
  const normalized = caption.trim();

  if (normalized.length === 0) {
    return "Caption is required.";
  }

  if (normalized.length > MAX_CAPTION_LENGTH) {
    return `Caption must be ${MAX_CAPTION_LENGTH} characters or less.`;
  }

  return "";
}

export function getCommentValidationMessage(content: string) {
  const normalized = content.trim();

  if (normalized.length === 0) {
    return "Comment is required.";
  }

  if (normalized.length > MAX_COMMENT_LENGTH) {
    return `Comment must be ${MAX_COMMENT_LENGTH} characters or less.`;
  }

  return "";
}

export function getDisplayNameValidationMessage(displayName: string) {
  if (displayName.trim().length === 0) {
    return "Display name is required.";
  }

  return "";
}

export function getBioValidationMessage(bio: string) {
  if (bio.trim().length > MAX_BIO_LENGTH) {
    return `Bio must be ${MAX_BIO_LENGTH} characters or less.`;
  }

  return "";
}

export function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, MAX_TAGS);
}
