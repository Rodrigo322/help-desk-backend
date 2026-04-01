import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

import { AppError } from "../../../shared/errors/app-error";
import { DepartmentsRepository } from "../../departments/repositories/departments-repository";
import { UsersRepository } from "../repositories/users-repository";

export type UpdateUserUseCaseRequest = {
  userId: string;
  name: string;
  email: string;
  departmentId: string;
  role: UserRole;
  password?: string;
};

export type UpdateUserUseCaseResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    departmentId: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class UpdateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly departmentsRepository: DepartmentsRepository
  ) {}

  async execute(input: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existingUser = await this.usersRepository.findById(input.userId);

    if (!existingUser) {
      throw new AppError("User not found.", 404);
    }

    const department = await this.departmentsRepository.findById(input.departmentId);

    if (!department) {
      throw new AppError("Department not found.", 404);
    }

    if (!department.isActive) {
      throw new AppError("Department is inactive.", 409);
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(normalizedEmail);

    if (userWithSameEmail && userWithSameEmail.id !== input.userId) {
      throw new AppError("Email already in use.", 409);
    }

    const hashedPassword = input.password ? await hash(input.password, 10) : undefined;

    const user = await this.usersRepository.update({
      userId: input.userId,
      name: input.name,
      email: normalizedEmail,
      departmentId: input.departmentId,
      role: input.role,
      ...(hashedPassword ? { password: hashedPassword } : {})
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        departmentId: user.departmentId,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
}
