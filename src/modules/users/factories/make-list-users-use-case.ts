import { PrismaDepartmentsRepository } from "../../departments/repositories/prisma/prisma-departments-repository";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { ListUsersUseCase } from "../use-cases/list-users-use-case";

export function makeListUsersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const departmentsRepository = new PrismaDepartmentsRepository();

  return new ListUsersUseCase(usersRepository, departmentsRepository);
}
