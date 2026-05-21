export interface AuthUser {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (credentials: AuthCredentials) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}
