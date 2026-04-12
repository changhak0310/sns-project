import { setSessionUser } from "@/lib/session/auth-session";
import {
  apiSuccess,
  ApiRouteError,
  handleRouteError,
  readJsonBody,
  requireSessionUser,
} from "@/lib/api/route-utils";
import { socialRepository } from "@/lib/social-repository/social-repository";
import {
  getBioValidationMessage,
  getDisplayNameValidationMessage,
} from "@/lib/validators/social";

type UpdateProfileBody = {
  displayName?: unknown;
  bio?: unknown;
  avatarUrl?: unknown;
};

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const sessionUser = await requireSessionUser();
    const body = await readJsonBody<UpdateProfileBody>(request);
    const displayName =
      typeof body.displayName === "string" ? body.displayName.trim() : "";
    const bio = typeof body.bio === "string" ? body.bio.trim() : "";
    const avatarUrl = typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : "";
    const details: Record<string, string> = {};

    const displayNameMessage = getDisplayNameValidationMessage(displayName);
    if (displayNameMessage) {
      details.displayName = displayNameMessage;
    }

    const bioMessage = getBioValidationMessage(bio);
    if (bioMessage) {
      details.bio = bioMessage;
    }

    if (Object.keys(details).length > 0) {
      throw new ApiRouteError("Update profile payload is invalid.", 400, details);
    }

    const data = socialRepository.updateProfile({
      userId: sessionUser.id,
      displayName,
      bio,
      avatarUrl,
    });

    await setSessionUser(data.sessionUser);

    return apiSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
