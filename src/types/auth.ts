import type { AdminUser } from "./admin";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken?: string;
  token?: string;
  jwt?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: AdminUser;
};
