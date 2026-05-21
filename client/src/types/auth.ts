export interface AuthUser {
  username: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (credentials: AuthCredentials) => Promise<AuthUser>;
  logout: () => void;
}
