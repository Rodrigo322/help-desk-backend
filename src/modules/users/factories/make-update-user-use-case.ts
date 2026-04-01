import { PrismaDepartmentsRepository } from "../../departments/repositories/prisma/prisma-departments-repository";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { UpdateUserUseCase } from "../use-cases/update-user-use-case";

export function makeUpdateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const departmentsRepository = new PrismaDepartmentsRepository();

  return new UpdateUserUseCase(usersRepository, departmentsRepository);
}
