import { cookies } from "next/headers";

export const runtime = "nodejs";

const SESSION_COOKIE_NAME = "orbit-session";
const LOGOUT_FAILURE_MESSAGE =
  "\uB85C\uADF8\uC544\uC6C3 \uCC98\uB9AC \uC911 \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";
const SERVER_ERROR_MESSAGE =
  "\uC11C\uBC84 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";

function createFailureResponse(message: string, status: number) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function POST() {
  try {
    const cookieStore = await cookies();

    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      return createFailureResponse(LOGOUT_FAILURE_MESSAGE, 500);
    }

    return Response.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch {
    return createFailureResponse(SERVER_ERROR_MESSAGE, 500);
  }
}
