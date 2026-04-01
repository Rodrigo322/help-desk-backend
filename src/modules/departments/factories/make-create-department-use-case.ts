import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaDepartmentsRepository } from "../repositories/prisma/prisma-departments-repository";
import { CreateDepartmentUseCase } from "../use-cases/create-department-use-case";

export function makeCreateDepartmentUseCase() {
  const departmentsRepository = new PrismaDepartmentsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new CreateDepartmentUseCase(departmentsRepository, usersRepository);
}
