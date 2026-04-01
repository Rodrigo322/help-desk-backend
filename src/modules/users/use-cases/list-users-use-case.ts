import { UserRole } from "@prisma/client";

import { DepartmentsRepository } from "../../departments/repositories/departments-repository";
import { UsersRepository } from "../repositories/users-repository";

export type ListUsersUseCaseRequest = {
  includeInactive?: boolean;
};

export type ListUsersUseCaseResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    departmentId: string;
    departmentName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class ListUsersUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly departmentsRepository: DepartmentsRepository
  ) {}

  async execute(input: ListUsersUseCaseRequest = {}): Promise<ListUsersUseCaseResponse> {
    const [users, departments] = await Promise.all([
      this.usersRepository.list({ includeInactive: input.includeInactive }),
      this.departmentsRepository.list({ includeInactive: true })
    ]);

    const departmentById = new Map(departments.map((department) => [department.id, department.name]));

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        departmentId: user.departmentId,
        departmentName: departmentById.get(user.departmentId) ?? "Departamento removido",
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    };
  }
}
