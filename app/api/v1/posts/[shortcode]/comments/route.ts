import {
  apiSuccess,
  ApiRouteError,
  handleRouteError,
  readJsonBody,
  requireSessionUser,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";
import { getCommentValidationMessage } from "@/lib/validators/social";

type CreateCommentBody = {
  content?: unknown;
};

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ shortcode: string }> }
) {
  try {
    const sessionUser = await requireSessionUser();
    const body = await readJsonBody<CreateCommentBody>(request);
    const { shortcode } = await context.params;
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const contentMessage = getCommentValidationMessage(content);

    if (contentMessage) {
      throw new ApiRouteError("Create comment payload is invalid.", 400, {
        content: contentMessage,
      });
    }

    const comment = socialRepository.createComment({
      shortcode,
      authorId: sessionUser.id,
      content,
    });

    return apiSuccess({ comment }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
