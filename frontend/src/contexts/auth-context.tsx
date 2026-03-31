import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { setUnauthorizedHandler } from "../services/api";
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

function readInitialSession() {
  const storedToken = getAuthToken();
  const storedUser = getAuthUser();

  if (storedToken && storedUser) {
    return {
      token: storedToken,
      user: storedUser
    };
  }

  if (storedToken && !storedUser) {
    clearAuthStorage();
  }

  return {
    token: null,
    user: null
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSessionState] = useState(readInitialSession);
  const { token, user } = session;

  const clearSession = useCallback(() => {
    setSessionState({
      token: null,
      user: null
    });
    clearAuthStorage();
  }, []);

  function setSession(session: SignInResponse) {
    setSessionState({
      token: session.token,
      user: session.user
    });
    setAuthToken(session.token);
    setAuthUser(session.user);
  }

  function signOut() {
    clearSession();
  }

  useEffect(() => {
    setUnauthorizedHandler(clearSession);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [clearSession]);

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
