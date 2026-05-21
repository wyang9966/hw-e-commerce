import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../lib/api/auth";
import type { AuthContextValue, AuthCredentials, AuthUser } from "../types/auth";

const AUTH_STORAGE_KEY = "ecommerce-auth-user";

const AuthContext = createContext<AuthContextValue | null>(null);

const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  const login = async (credentials: AuthCredentials) => {
    const authenticatedUser = await authAPI.login(credentials);
    setUser(authenticatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const value = useMemo(
    () => ({ user, login, logout, updateUser }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
