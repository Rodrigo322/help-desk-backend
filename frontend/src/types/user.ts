import { UserRole } from "./auth";

export type User = {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  departmentId: string;
  role: UserRole;
};

export type CreateUserResponse = {
  user: User;
};

export type ListUsersResponse = {
  users: User[];
};

export type GetUserByIdResponse = {
  user: User;
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  departmentId: string;
  role: UserRole;
  password?: string;
};

export type UpdateUserResponse = {
  user: User;
};

export type UpdateUserStatusPayload = {
  isActive: boolean;
};

export type UpdateUserStatusResponse = {
  user: User;
};
