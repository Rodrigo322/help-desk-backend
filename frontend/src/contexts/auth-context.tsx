import { createContext, ReactNode, useMemo, useState } from "react";

import { AuthUser, SignInResponse } from "../types/auth";
import {
  clearAuthStorage,
  getAuthToken,
  getAuthUser,
  setAuthToken,
  setAuthUser
} from "../utils/storage";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (session: SignInResponse) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  function setSession(session: SignInResponse) {
    setToken(session.token);
    setUser(session.user);
    setAuthToken(session.token);
    setAuthUser(session.user);
  }

  function signOut() {
    setToken(null);
    setUser(null);
    clearAuthStorage();
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      setSession,
      signOut
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

