import { AppError } from "../../../shared/errors/app-error";

import { DepartmentsRepository } from "../repositories/departments-repository";

export type GetDepartmentByIdUseCaseRequest = {
  departmentId: string;
};

export type GetDepartmentByIdUseCaseResponse = {
  department: {
    id: string;
    name: string;
    managerUserId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class GetDepartmentByIdUseCase {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async execute(input: GetDepartmentByIdUseCaseRequest): Promise<GetDepartmentByIdUseCaseResponse> {
    const department = await this.departmentsRepository.findById(input.departmentId);

    if (!department) {
      throw new AppError("Department not found.", 404);
    }

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
