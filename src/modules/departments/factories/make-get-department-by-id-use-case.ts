import { PrismaDepartmentsRepository } from "../repositories/prisma/prisma-departments-repository";
import { GetDepartmentByIdUseCase } from "../use-cases/get-department-by-id-use-case";

export function makeGetDepartmentByIdUseCase() {
  const departmentsRepository = new PrismaDepartmentsRepository();

  return new GetDepartmentByIdUseCase(departmentsRepository);
}
