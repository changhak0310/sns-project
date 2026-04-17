import {
  apiSuccess,
  ApiRouteError,
  getQueryParam,
  handleRouteError,
  requireSessionUser,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sessionUser = await requireSessionUser();
    const url = new URL(request.url);
    const filter = getQueryParam(url.searchParams, "filter");

    if (
      filter &&
      filter !== "all" &&
      filter !== "like" &&
      filter !== "comment" &&
      filter !== "follow"
    ) {
      throw new ApiRouteError("Invalid notifications filter.", 400, {
        filter: "Expected all, like, comment, or follow.",
      });
    }

    return apiSuccess(
      socialRepository.getNotifications({
        viewerId: sessionUser.id,
        filter: (filter as "all" | "like" | "comment" | "follow" | null) ?? "all",
      })
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
