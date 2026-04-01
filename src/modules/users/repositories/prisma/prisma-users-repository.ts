import { prisma } from "../../../../database/prisma";
import {
  CreateUserRepositoryInput,
  ListUsersRepositoryInput,
  UpdateUserRepositoryInput,
  UserEntity,
  UsersRepository
} from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      departmentId: user.departmentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive"
        }
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      departmentId: user.departmentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async list(input?: ListUsersRepositoryInput): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: input?.includeInactive ? undefined : { isActive: true },
      orderBy: {
        createdAt: "asc"
      }
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      departmentId: user.departmentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async create(data: CreateUserRepositoryInput): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        departmentId: data.departmentId,
        role: data.role,
        isActive: data.isActive ?? true
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      departmentId: user.departmentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async update(data: UpdateUserRepositoryInput): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: {
        id: data.userId
      },
      data: {
        name: data.name,
        email: data.email,
        departmentId: data.departmentId,
        role: data.role,
        ...(data.password ? { password: data.password } : {})
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      departmentId: user.departmentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async setActive(userId: string, isActive: boolean): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isActive
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      departmentId: user.departmentId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
