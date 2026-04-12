import {
  apiSuccess,
  ApiRouteError,
  handleRouteError,
  readJsonBody,
  requireSessionUser,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";
import {
  getCaptionValidationMessage,
  normalizeTags,
} from "@/lib/validators/social";

type CreatePostBody = {
  caption?: unknown;
  location?: unknown;
  mediaLabel?: unknown;
  category?: unknown;
  tags?: unknown;
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const sessionUser = await requireSessionUser();
    const body = await readJsonBody<CreatePostBody>(request);
    const caption = typeof body.caption === "string" ? body.caption.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const mediaLabel =
      typeof body.mediaLabel === "string" ? body.mediaLabel.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const tags = normalizeTags(body.tags);
    const details: Record<string, string> = {};

    const captionMessage = getCaptionValidationMessage(caption);
    if (captionMessage) {
      details.caption = captionMessage;
    }

    if (Object.keys(details).length > 0) {
      throw new ApiRouteError("Create post payload is invalid.", 400, details);
    }

    const post = socialRepository.createPost({
      authorId: sessionUser.id,
      caption,
      location,
      mediaLabel,
      category,
      tags,
    });

    return apiSuccess({ post }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
