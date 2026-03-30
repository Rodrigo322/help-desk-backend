import { prisma } from "../../../../database/prisma";
import {
  CreateUserRepositoryInput,
  UserEntity,
  UsersRepository
} from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async create(data: CreateUserRepositoryInput): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
