import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaDepartmentsRepository } from "../repositories/prisma/prisma-departments-repository";
import { UpdateDepartmentUseCase } from "../use-cases/update-department-use-case";

export function makeUpdateDepartmentUseCase() {
  const departmentsRepository = new PrismaDepartmentsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new UpdateDepartmentUseCase(departmentsRepository, usersRepository);
}
