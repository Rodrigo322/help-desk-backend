import { randomUUID } from "node:crypto";
import { UserRole } from "@prisma/client";

import {
  CreateUserRepositoryInput,
  ListUsersRepositoryInput,
  UpdateUserRepositoryInput,
  UserEntity,
  UsersRepository
} from "../../../../src/modules/users/repositories/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: UserEntity[] = [];

  async findById(userId: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.id === userId);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async list(input?: ListUsersRepositoryInput): Promise<UserEntity[]> {
    if (input?.includeInactive) {
      return this.items;
    }

    return this.items.filter((item) => item.isActive);
  }

  async create(data: CreateUserRepositoryInput): Promise<UserEntity> {
    const user: UserEntity = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      departmentId: data.departmentId,
      role: (data.role ?? "EMPLOYEE") as UserRole,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.push(user);

    return user;
  }

  async update(data: UpdateUserRepositoryInput): Promise<UserEntity> {
    const userIndex = this.items.findIndex((item) => item.id === data.userId);

    if (userIndex < 0) {
      throw new Error("User not found.");
    }

    const currentUser = this.items[userIndex];
    const updatedUser: UserEntity = {
      ...currentUser,
      name: data.name,
      email: data.email,
      departmentId: data.departmentId,
      role: data.role,
      password: data.password ?? currentUser.password,
      updatedAt: new Date()
    };

    this.items[userIndex] = updatedUser;
    return updatedUser;
  }

  async setActive(userId: string, isActive: boolean): Promise<UserEntity> {
    const userIndex = this.items.findIndex((item) => item.id === userId);

    if (userIndex < 0) {
      throw new Error("User not found.");
    }

    const updatedUser: UserEntity = {
      ...this.items[userIndex],
      isActive,
      updatedAt: new Date()
    };

    this.items[userIndex] = updatedUser;
    return updatedUser;
  }
}
