import {
  apiSuccess,
  getNumberParam,
  getOptionalSessionUser,
  getQueryParam,
  handleRouteError,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sessionUser = await getOptionalSessionUser();
    const url = new URL(request.url);
    const limit = getNumberParam(url.searchParams, "limit", 10, {
      min: 1,
      max: 50,
    });
    const cursor = getQueryParam(url.searchParams, "cursor");

    return apiSuccess(
      socialRepository.getFeed({
        viewerId: sessionUser?.id,
        cursor,
        limit,
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
