import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { UpdateUserStatusUseCase } from "../use-cases/update-user-status-use-case";

export function makeUpdateUserStatusUseCase() {
  const usersRepository = new PrismaUsersRepository();

  return new UpdateUserStatusUseCase(usersRepository);
}
