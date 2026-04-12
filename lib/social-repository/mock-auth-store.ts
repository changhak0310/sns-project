import "server-only";

import type { SessionUser, User } from "@/types/auth";

type MockAuthUserRecord = User & {
  password: string;
};

const mockAuthUsers: MockAuthUserRecord[] = [
  {
    id: 1,
    email: "preview@orbit.local",
    name: "Preview User",
    username: "preview-user",
    avatarUrl: "",
    accessToken: "mock-preview-token",
    password: "orbit123",
  },
  {
    id: 2,
    email: "team@orbit.local",
    name: "Orbit Team",
    username: "orbit-team",
    avatarUrl: "",
    accessToken: "mock-team-token",
    password: "orbit123",
  },
  {
    id: 3,
    email: "city@orbit.local",
    name: "City Frames",
    username: "city.frames",
    avatarUrl: "",
    accessToken: "mock-city-token",
    password: "orbit123",
  },
  {
    id: 4,
    email: "mina@orbit.local",
    name: "Studio Mina",
    username: "studio.mina",
    avatarUrl: "",
    accessToken: "mock-mina-token",
    password: "orbit123",
  },
];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function buildDisplayName(username: string) {
  const tokens = username
    .split(/[._-]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return "Orbit User";
  }

  return tokens
    .map((token) => token[0]?.toUpperCase() + token.slice(1))
    .join(" ");
}

function toPublicUser(record: MockAuthUserRecord): User {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    username: record.username,
    avatarUrl: record.avatarUrl,
    accessToken: record.accessToken,
  };
}

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

export const mockAuthStore = {
  findUserByEmail(email: string) {
    const normalizedEmail = normalizeEmail(email);

    return (
      mockAuthUsers.find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null
    );
  },

  findUserById(id: number) {
    return mockAuthUsers.find((user) => user.id === id) ?? null;
  },

  findUserByUsername(username: string) {
    const normalizedUsername = normalizeUsername(username);

    return (
      mockAuthUsers.find(
        (user) => normalizeUsername(user.username) === normalizedUsername
      ) ?? null
    );
  },

  hasEmail(email: string) {
    return this.findUserByEmail(email) !== null;
  },

  hasUsername(username: string) {
    return this.findUserByUsername(username) !== null;
  },

  listPublicUsers() {
    return mockAuthUsers.map((user) => toPublicUser(user));
  },

  createUser(input: { username: string; email: string; password: string }) {
    const username = input.username.trim();
    const email = normalizeEmail(input.email);

    const nextUser: MockAuthUserRecord = {
      id: mockAuthUsers.length + 1,
      email,
      name: buildDisplayName(username),
      username,
      avatarUrl: "",
      accessToken: `mock-${crypto.randomUUID()}`,
      password: input.password,
    };

    mockAuthUsers.unshift(nextUser);

    return toPublicUser(nextUser);
  },

  updateUserProfile(input: {
    userId: number;
    name: string;
    avatarUrl: string;
  }) {
    const user = this.findUserById(input.userId);

    if (!user) {
      return null;
    }

    user.name = input.name;
    user.avatarUrl = input.avatarUrl;

    return toPublicUser(user);
  },

  toPublicUser,
  toSessionUser,
};
