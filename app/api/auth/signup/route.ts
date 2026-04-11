import { authServerRepository } from "@/lib/social-repository/auth-server-repository";
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
  getUsernameValidationMessage,
} from "@/lib/validators/auth";

export const runtime = "nodejs";

type SignupRequestPayload = {
  username?: unknown;
  email?: unknown;
  password?: unknown;
};

const USERNAME_TAKEN_MESSAGE =
  "\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uC0AC\uC6A9\uC790 \uC774\uB984\uC785\uB2C8\uB2E4.";
const EMAIL_TAKEN_MESSAGE =
  "\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4.";
const SERVER_ERROR_MESSAGE =
  "\uC11C\uBC84 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";

function toSignupInput(payload: unknown) {
  const body =
    payload && typeof payload === "object"
      ? (payload as SignupRequestPayload)
      : {};

  return {
    username: typeof body.username === "string" ? body.username : "",
    email: typeof body.email === "string" ? body.email : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

function getSignupValidationMessage(input: {
  username: string;
  email: string;
  password: string;
}) {
  const usernameMessage = getUsernameValidationMessage(input.username);

  if (usernameMessage) {
    return usernameMessage;
  }

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
    const input = toSignupInput(await request.json());
    const validationMessage = getSignupValidationMessage(input);

    if (validationMessage) {
      return createFailureResponse(validationMessage, 400);
    }

    const existingUsernameUser = await authServerRepository.findUserByUsername(
      input.username
    );

    if (existingUsernameUser) {
      return createFailureResponse(USERNAME_TAKEN_MESSAGE, 409);
    }

    const existingEmailUser = await authServerRepository.findUserByEmail(
      input.email
    );

    if (existingEmailUser) {
      return createFailureResponse(EMAIL_TAKEN_MESSAGE, 409);
    }

    const user = await authServerRepository.createUser(input);

    return Response.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch {
    return createFailureResponse(SERVER_ERROR_MESSAGE, 500);
  }
}
