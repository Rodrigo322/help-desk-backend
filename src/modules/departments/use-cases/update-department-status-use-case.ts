import { AppError } from "../../../shared/errors/app-error";

import { DepartmentsRepository } from "../repositories/departments-repository";

export type UpdateDepartmentStatusUseCaseRequest = {
  departmentId: string;
  isActive: boolean;
};

export type UpdateDepartmentStatusUseCaseResponse = {
  department: {
    id: string;
    name: string;
    managerUserId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class UpdateDepartmentStatusUseCase {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async execute(
    input: UpdateDepartmentStatusUseCaseRequest
  ): Promise<UpdateDepartmentStatusUseCaseResponse> {
    const department = await this.departmentsRepository.findById(input.departmentId);

    if (!department) {
      throw new AppError("Department not found.", 404);
    }

    const updatedDepartment = await this.departmentsRepository.setActive(
      input.departmentId,
      input.isActive
    );

    return {
      department: {
        id: updatedDepartment.id,
        name: updatedDepartment.name,
        managerUserId: updatedDepartment.managerUserId,
        isActive: updatedDepartment.isActive,
        createdAt: updatedDepartment.createdAt,
        updatedAt: updatedDepartment.updatedAt
      }
    };
  }
}
