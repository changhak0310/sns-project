import { authServerRepository } from "@/lib/social-repository/auth-server-repository";
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from "@/lib/validators/auth";

export const runtime = "nodejs";

type LoginRequestPayload = {
  email?: unknown;
  password?: unknown;
};

const INVALID_CREDENTIALS_MESSAGE =
  "\uC774\uBA54\uC77C \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
const SERVER_ERROR_MESSAGE =
  "\uC11C\uBC84 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";

function toLoginInput(payload: unknown) {
  const body =
    payload && typeof payload === "object"
      ? (payload as LoginRequestPayload)
      : {};

  return {
    email: typeof body.email === "string" ? body.email : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

function getLoginValidationMessage(input: {
  email: string;
  password: string;
}) {
  const emailMessage = getEmailValidationMessage(input.email);

  if (emailMessage) {
    return emailMessage;
  }

  return getPasswordValidationMessage(input.password);
}

function createFailureResponse(message: string, status: number) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const input = toLoginInput(await request.json());
    const validationMessage = getLoginValidationMessage(input);

    if (validationMessage) {
      return createFailureResponse(validationMessage, 400);
    }

    const user = await authServerRepository.verifyUserCredentials(
      input.email,
      input.password
    );

    if (!user) {
      return createFailureResponse(INVALID_CREDENTIALS_MESSAGE, 401);
    }

    return Response.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch {
    return createFailureResponse(SERVER_ERROR_MESSAGE, 500);
  }
}
