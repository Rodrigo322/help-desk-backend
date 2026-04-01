import { AppError } from "../../../shared/errors/app-error";
import { UsersRepository } from "../../users/repositories/users-repository";

import { DepartmentsRepository } from "../repositories/departments-repository";

export type UpdateDepartmentUseCaseRequest = {
  departmentId: string;
  name: string;
  managerUserId?: string;
};

export type UpdateDepartmentUseCaseResponse = {
  department: {
    id: string;
    name: string;
    managerUserId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class UpdateDepartmentUseCase {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(input: UpdateDepartmentUseCaseRequest): Promise<UpdateDepartmentUseCaseResponse> {
    const currentDepartment = await this.departmentsRepository.findById(input.departmentId);

    if (!currentDepartment) {
      throw new AppError("Department not found.", 404);
    }

    const sameNameDepartment = await this.departmentsRepository.findByNameExcludingId(
      input.name,
      input.departmentId
    );

    if (sameNameDepartment) {
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

    const department = await this.departmentsRepository.update({
      departmentId: input.departmentId,
      name: input.name,
      managerUserId: input.managerUserId ?? null
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
