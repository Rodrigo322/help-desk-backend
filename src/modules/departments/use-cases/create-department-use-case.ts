import { AppError } from "../../../shared/errors/app-error";
import { UsersRepository } from "../../users/repositories/users-repository";
import { DepartmentsRepository } from "../repositories/departments-repository";

export type CreateDepartmentUseCaseRequest = {
  name: string;
  managerUserId?: string;
};

export type CreateDepartmentUseCaseResponse = {
  department: {
    id: string;
    name: string;
    managerUserId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class CreateDepartmentUseCase {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    input: CreateDepartmentUseCaseRequest
  ): Promise<CreateDepartmentUseCaseResponse> {
    const departmentAlreadyExists = await this.departmentsRepository.findByName(input.name);

    if (departmentAlreadyExists) {
      throw new AppError("Department name already in use.", 409);
    }

    if (input.managerUserId) {
      const manager = await this.usersRepository.findById(input.managerUserId);

      if (!manager) {
        throw new AppError("Manager user not found.", 404);
      }

      if (!manager.isActive) {
        throw new AppError("Manager user is inactive.", 409);
      }
    }

    const department = await this.departmentsRepository.create({
      name: input.name,
      ...(input.managerUserId ? { managerUserId: input.managerUserId } : {})
    });

    return {
      department: {
        id: department.id,
        name: department.name,
        managerUserId: department.managerUserId,
        isActive: department.isActive,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt
      }
    };
  }
}
