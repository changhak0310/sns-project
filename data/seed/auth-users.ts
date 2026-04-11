export type AuthUserSeedRecord = {
  id: number;
  email: string;
  username: string;
  name: string;
  avatarUrl: string;
  passwordHash: string;
};

export const AUTH_USER_SEED: AuthUserSeedRecord[] = [];
