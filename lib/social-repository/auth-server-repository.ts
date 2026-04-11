import "server-only";

import { compare, hash } from "bcryptjs";

import { AUTH_USER_SEED, type AuthUserSeedRecord } from "@/data/seed/auth-users";
import type { User } from "@/types/auth";

type CreateAuthUserInput = {
  username: string;
  email: string;
  password: string;
};

type AuthStore = {
  users: AuthUserSeedRecord[];
  nextUserId: number;
};

declare global {
  var __orbitAuthStore: AuthStore | undefined;
}

function cloneSeedUsers() {
  return AUTH_USER_SEED.map((user) => ({ ...user }));
}

function getInitialNextUserId(users: AuthUserSeedRecord[]) {
  return users.reduce((maxUserId, user) => Math.max(maxUserId, user.id), 0) + 1;
}

function getAuthStore() {
  if (!globalThis.__orbitAuthStore) {
    const users = cloneSeedUsers();

    globalThis.__orbitAuthStore = {
      users,
      nextUserId: getInitialNextUserId(users),
    };
  }

  return globalThis.__orbitAuthStore;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function buildAvatarUrl(username: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}`;
}

function createAccessToken() {
  return `signup-token-${crypto.randomUUID()}`;
}

function toUser(record: AuthUserSeedRecord): User {
  return {
    id: record.id,
    email: record.email,
    name: record.name,
    username: record.username,
    avatarUrl: record.avatarUrl,
    accessToken: createAccessToken(),
  };
}

export const authServerRepository = {
  async findUserByUsername(username: string) {
    const store = getAuthStore();
    const normalizedUsername = username.toLowerCase();

    return (
      store.users.find(
        (user) => user.username.toLowerCase() === normalizedUsername
      ) ?? null
    );
  },

  async findUserByEmail(email: string) {
    const store = getAuthStore();
    const normalizedEmail = normalizeEmail(email);

    return store.users.find((user) => user.email === normalizedEmail) ?? null;
  },

  async verifyUserCredentials(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await compare(password, user.passwordHash);

    if (!passwordMatches) {
      return null;
    }

    return toUser(user);
  },

  async createUser({
    username,
    email,
    password,
  }: CreateAuthUserInput): Promise<User> {
    const store = getAuthStore();
    const passwordHash = await hash(password, 10);
    const record: AuthUserSeedRecord = {
      id: store.nextUserId,
      email: normalizeEmail(email),
      username,
      name: username,
      avatarUrl: buildAvatarUrl(username),
      passwordHash,
    };

    store.users.push(record);
    store.nextUserId += 1;

    return toUser(record);
  },
};
