import {
  apiSuccess,
  getOptionalSessionUser,
  handleRouteError,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shortcode: string }> }
) {
  try {
    const sessionUser = await getOptionalSessionUser();
    const { shortcode } = await context.params;

    return apiSuccess(
      socialRepository.getPost({
        shortcode,
        viewerId: sessionUser?.id,
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
