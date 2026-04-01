import { PrismaDepartmentsRepository } from "../../departments/repositories/prisma/prisma-departments-repository";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { GetUserByIdUseCase } from "../use-cases/get-user-by-id-use-case";

export function makeGetUserByIdUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const departmentsRepository = new PrismaDepartmentsRepository();

  return new GetUserByIdUseCase(usersRepository, departmentsRepository);
}
