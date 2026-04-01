import { AppError } from "../../../shared/errors/app-error";
import { DepartmentsRepository } from "../../departments/repositories/departments-repository";
import { UserRole } from "@prisma/client";
import { UsersRepository } from "../repositories/users-repository";

export type GetUserByIdUseCaseRequest = {
  userId: string;
};

export type GetUserByIdUseCaseResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    departmentId: string;
    departmentName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class GetUserByIdUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly departmentsRepository: DepartmentsRepository
  ) {}

  async execute(input: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const department = await this.departmentsRepository.findById(user.departmentId);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        departmentId: user.departmentId,
        departmentName: department?.name ?? "Departamento removido",
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
}
