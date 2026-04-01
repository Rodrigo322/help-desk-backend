import { DepartmentsRepository } from "../repositories/departments-repository";

export type ListDepartmentsUseCaseResponse = {
  departments: Array<{
    id: string;
    name: string;
    managerUserId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class ListDepartmentsUseCase {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async execute(input?: { includeInactive?: boolean }): Promise<ListDepartmentsUseCaseResponse> {
    const departments = await this.departmentsRepository.list({
      includeInactive: input?.includeInactive
    });

    return {
      departments: departments.map((department) => ({
        id: department.id,
        name: department.name,
        managerUserId: department.managerUserId,
        isActive: department.isActive,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt
      }))
    };
  }
}
