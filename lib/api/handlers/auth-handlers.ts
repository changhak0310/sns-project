import { clearSessionUser, getSessionUser, setSessionUser } from "@/lib/session/auth-session";
import { mockAuthStore } from "@/lib/social-repository/mock-auth-store";
import { socialRepository } from "@/lib/social-repository/social-repository";
import {
  apiSuccess,
  ApiRouteError,
  handleRouteError,
  readJsonBody,
} from "@/lib/api/route-utils";
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
  getUsernameValidationMessage,
} from "@/lib/validators/auth";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

type SignupBody = {
  username?: unknown;
  email?: unknown;
  password?: unknown;
};

function validateLoginInput(body: LoginBody) {
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const details: Record<string, string> = {};

  const emailMessage = getEmailValidationMessage(email);
  if (emailMessage) {
    details.email = emailMessage;
  }

  const passwordMessage = getPasswordValidationMessage(password);
  if (passwordMessage) {
    details.password = passwordMessage;
  }

  if (Object.keys(details).length > 0) {
    throw new ApiRouteError("Login payload is invalid.", 400, details);
  }

  return {
    email,
    password,
  };
}

function validateSignupInput(body: SignupBody) {
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const details: Record<string, string> = {};

  const usernameMessage = getUsernameValidationMessage(username);
  if (usernameMessage) {
    details.username = usernameMessage;
  }

  const emailMessage = getEmailValidationMessage(email);
  if (emailMessage) {
    details.email = emailMessage;
  }

  const passwordMessage = getPasswordValidationMessage(password);
  if (passwordMessage) {
    details.password = passwordMessage;
  }

  if (Object.keys(details).length > 0) {
    throw new ApiRouteError("Signup payload is invalid.", 400, details);
  }

  return {
    username,
    email,
    password,
  };
}

export async function handleLogin(request: Request) {
  try {
    const body = await readJsonBody<LoginBody>(request);
    const { email, password } = validateLoginInput(body);
    const matchedUser = mockAuthStore.findUserByEmail(email);

    if (!matchedUser || matchedUser.password !== password) {
      throw new ApiRouteError("Invalid email or password.", 401);
    }

    const user = mockAuthStore.toPublicUser(matchedUser);
    socialRepository.ensureProfileForUser(user);
    await setSessionUser(mockAuthStore.toSessionUser(user));

    return apiSuccess(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function handleSignup(request: Request) {
  try {
    const body = await readJsonBody<SignupBody>(request);
    const { username, email, password } = validateSignupInput(body);

    if (mockAuthStore.hasUsername(username)) {
      throw new ApiRouteError("Username already exists.", 409);
    }

    if (mockAuthStore.hasEmail(email)) {
      throw new ApiRouteError("Email already exists.", 409);
    }

    const user = mockAuthStore.createUser({
      username,
      email,
      password,
    });

    socialRepository.ensureProfileForUser(user);
    await setSessionUser(mockAuthStore.toSessionUser(user));

    return apiSuccess(user, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function handleLogout() {
  try {
    await clearSessionUser();

    return apiSuccess({
      loggedOut: true,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function handleMe() {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new ApiRouteError("Authentication required.", 401);
    }

    return apiSuccess(sessionUser);
  } catch (error) {
    return handleRouteError(error);
  }
}
