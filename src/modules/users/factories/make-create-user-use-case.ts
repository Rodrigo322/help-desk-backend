import { PrismaDepartmentsRepository } from "../../departments/repositories/prisma/prisma-departments-repository";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { CreateUserUseCase } from "../use-cases/create-user-use-case";

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const departmentsRepository = new PrismaDepartmentsRepository();
  const useCase = new CreateUserUseCase(usersRepository, departmentsRepository);

  return useCase;
}
