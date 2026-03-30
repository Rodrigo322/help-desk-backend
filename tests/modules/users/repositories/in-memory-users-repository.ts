import { randomUUID } from "node:crypto";

import {
  CreateUserRepositoryInput,
  UserEntity,
  UsersRepository
} from "../../../../src/modules/users/repositories/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: UserEntity[] = [];

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async create(data: CreateUserRepositoryInput): Promise<UserEntity> {
    const user: UserEntity = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.push(user);

    return user;
  }
}

