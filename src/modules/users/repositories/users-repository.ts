import { UserRole } from "@prisma/client";

export type CreateUserRepositoryInput = {
  name: string;
  email: string;
  password: string;
  departmentId: string;
  role: UserRole;
  isActive?: boolean;
};

export type UpdateUserRepositoryInput = {
  userId: string;
  name: string;
  email: string;
  departmentId: string;
  role: UserRole;
  password?: string;
};

export type UserEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
  departmentId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ListUsersRepositoryInput = {
  includeInactive?: boolean;
};

export interface UsersRepository {
  findById(userId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  list(input?: ListUsersRepositoryInput): Promise<UserEntity[]>;
  create(data: CreateUserRepositoryInput): Promise<UserEntity>;
  update(data: UpdateUserRepositoryInput): Promise<UserEntity>;
  setActive(userId: string, isActive: boolean): Promise<UserEntity>;
}
