import { AppError } from "../../../shared/errors/app-error";
import { hash } from "bcryptjs";
import { DepartmentsRepository } from "../../departments/repositories/departments-repository";
import { UserRole } from "@prisma/client";
import { UsersRepository } from "../repositories/users-repository";

export type CreateUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
  departmentId: string;
  role: UserRole;
};

export type CreateUserUseCaseResponse = {
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

export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly departmentsRepository: DepartmentsRepository
  ) {}

  async execute(input: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const { name, password, departmentId, role } = input;

    if (!name || !normalizedEmail || !password || !departmentId || !role) {
      throw new AppError("Invalid input.", 400);
    }

    const department = await this.departmentsRepository.findById(departmentId);

    if (!department) {
      throw new AppError("Department not found.", 404);
    }

    if (!department.isActive) {
      throw new AppError("Department is inactive.", 409);
    }

    const userAlreadyExists = await this.usersRepository.findByEmail(normalizedEmail);

    if (userAlreadyExists) {
      throw new AppError("Email already in use.", 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      departmentId,
      role
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
