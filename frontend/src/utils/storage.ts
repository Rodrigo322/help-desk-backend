import { z } from "zod";

import { AuthUser } from "../types/auth";

const TOKEN_KEY = "tickets:token";
const USER_KEY = "tickets:user";

const authUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  departmentId: z.string().min(1),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"])
});

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
    const parsed = JSON.parse(rawUser);
    const validated = authUserSchema.safeParse(parsed);

    if (!validated.success) {
      return null;
    }

    return validated.data;
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
