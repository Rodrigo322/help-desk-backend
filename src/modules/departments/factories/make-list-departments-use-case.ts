import { PrismaDepartmentsRepository } from "../repositories/prisma/prisma-departments-repository";
import { ListDepartmentsUseCase } from "../use-cases/list-departments-use-case";

export function makeListDepartmentsUseCase() {
  const departmentsRepository = new PrismaDepartmentsRepository();

  return new ListDepartmentsUseCase(departmentsRepository);
}
