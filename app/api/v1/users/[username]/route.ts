import {
  apiSuccess,
  ApiRouteError,
  getOptionalSessionUser,
  getQueryParam,
  handleRouteError,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const sessionUser = await getOptionalSessionUser();
    const { username } = await context.params;
    const url = new URL(request.url);
    const tab = getQueryParam(url.searchParams, "tab");

    if (tab && tab !== "posts" && tab !== "saved") {
      throw new ApiRouteError("Invalid profile tab.", 400, {
        tab: "Expected posts or saved.",
      });
    }

    return apiSuccess(
      socialRepository.getProfile({
        username,
        viewerId: sessionUser?.id,
        tab: tab === "posts" || tab === "saved" ? tab : undefined,
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
