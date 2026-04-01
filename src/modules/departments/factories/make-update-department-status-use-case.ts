import { PrismaDepartmentsRepository } from "../repositories/prisma/prisma-departments-repository";
import { UpdateDepartmentStatusUseCase } from "../use-cases/update-department-status-use-case";

export function makeUpdateDepartmentStatusUseCase() {
  const departmentsRepository = new PrismaDepartmentsRepository();

  return new UpdateDepartmentStatusUseCase(departmentsRepository);
}
