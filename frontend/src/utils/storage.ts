import { AuthUser } from "../types/auth";

const TOKEN_KEY = "tickets:token";
const USER_KEY = "tickets:user";

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setAuthUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function removeAuthUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage() {
  removeAuthToken();
  removeAuthUser();
}

