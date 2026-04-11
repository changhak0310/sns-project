import type {
  LoginApiResponse,
  LogoutApiResponse,
  SignupApiResponse,
  User,
} from "@/types/auth";

type AuthApiResponse = LoginApiResponse | SignupApiResponse;
type AuthResponsePayload = {
  success?: boolean;
  data?: User;
  message?: string;
};
type LogoutResponsePayload = {
  success?: boolean;
  message?: string;
};
type JsonPostBody = Record<string, string>;

const SERVER_ERROR_MESSAGE =
  "\uC11C\uBC84 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";
const NETWORK_ERROR_MESSAGE =
  "\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";

function createAuthFailureResponse<T extends AuthApiResponse>(message: string) {
  return {
    success: false,
    message,
  } as T;
}

function createLogoutFailureResponse(message: string): LogoutApiResponse {
  return {
    success: false,
    message,
  };
}

function createJsonPostRequest(body: JsonPostBody): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

async function postAuthRequest<T extends AuthApiResponse>(
  url: string,
  body: JsonPostBody
): Promise<T> {
  try {
    const response = await fetch(url, createJsonPostRequest(body));

    return parseAuthResponse<T>(response);
  } catch {
    return createAuthFailureResponse<T>(NETWORK_ERROR_MESSAGE);
  }
}

async function parseAuthResponse<T extends AuthApiResponse>(
  response: Response
): Promise<T> {
  try {
    const payload = (await response.json()) as AuthResponsePayload;

    if (payload.success === true && payload.data) {
      return {
        success: true,
        data: payload.data,
      } as T;
    }

    if (payload.success === false && typeof payload.message === "string") {
      return {
        success: false,
        message: payload.message,
      } as T;
    }
  } catch {
    return createAuthFailureResponse<T>(SERVER_ERROR_MESSAGE);
  }

  return createAuthFailureResponse<T>(SERVER_ERROR_MESSAGE);
}

async function parseLogoutResponse(
  response: Response
): Promise<LogoutApiResponse> {
  try {
    const payload = (await response.json()) as LogoutResponsePayload;

    if (payload.success === true) {
      return {
        success: true,
      };
    }

    if (payload.success === false && typeof payload.message === "string") {
      return {
        success: false,
        message: payload.message,
      };
    }
  } catch {
    return createLogoutFailureResponse(SERVER_ERROR_MESSAGE);
  }

  return createLogoutFailureResponse(SERVER_ERROR_MESSAGE);
}

export const authRepository = {
  async login(email: string, password: string): Promise<LoginApiResponse> {
    return postAuthRequest<LoginApiResponse>("/api/auth/login", {
      email,
      password,
    });
  },

  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<SignupApiResponse> {
    return postAuthRequest<SignupApiResponse>("/api/auth/signup", {
      username,
      email,
      password,
    });
  },

  async logout(): Promise<LogoutApiResponse> {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      return parseLogoutResponse(response);
    } catch {
      return createLogoutFailureResponse(NETWORK_ERROR_MESSAGE);
    }
  },
};
