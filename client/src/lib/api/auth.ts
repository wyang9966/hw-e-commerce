import type { AuthCredentials, AuthUser } from "../../types/auth";

const VALID_CREDENTIALS = {
  username: "emilys",
  password: "emilyspass",
};

export const authAPI = {
  login: async (credentials: AuthCredentials): Promise<AuthUser> => {
    const normalizedUsername = credentials.username.trim();

    if (
      normalizedUsername === VALID_CREDENTIALS.username &&
      credentials.password === VALID_CREDENTIALS.password
    ) {
      return { username: VALID_CREDENTIALS.username };
    }

    throw new Error("Invalid username or password");
  },
};
