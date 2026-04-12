import {
  apiSuccess,
  handleRouteError,
  requireSessionUser,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";

export const dynamic = "force-dynamic";

export async function PUT(
  _request: Request,
  context: { params: Promise<{ shortcode: string }> }
) {
  try {
    const sessionUser = await requireSessionUser();
    const { shortcode } = await context.params;

    return apiSuccess({
      post: socialRepository.setLike({
        shortcode,
        viewerId: sessionUser.id,
        liked: true,
      }),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ shortcode: string }> }
) {
  try {
    const sessionUser = await requireSessionUser();
    const { shortcode } = await context.params;

    return apiSuccess({
      post: socialRepository.setLike({
        shortcode,
        viewerId: sessionUser.id,
        liked: false,
      }),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
