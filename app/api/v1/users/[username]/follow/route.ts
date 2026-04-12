import {
  apiSuccess,
  handleRouteError,
  requireSessionUser,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";

export const dynamic = "force-dynamic";

export async function PUT(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const sessionUser = await requireSessionUser();
    const { username } = await context.params;

    return apiSuccess(
      socialRepository.setFollow({
        username,
        viewerId: sessionUser.id,
        following: true,
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const sessionUser = await requireSessionUser();
    const { username } = await context.params;

    return apiSuccess(
      socialRepository.setFollow({
        username,
        viewerId: sessionUser.id,
        following: false,
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
