import {
  apiSuccess,
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
    const q = getQueryParam(url.searchParams, "q");

    return apiSuccess(
      socialRepository.getExplore({
        viewerId: sessionUser?.id,
        q,
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
