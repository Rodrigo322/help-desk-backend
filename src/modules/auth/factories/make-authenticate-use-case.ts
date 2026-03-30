import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../use-cases/authenticate-use-case";

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AuthenticateUseCase(usersRepository);

  return useCase;
}

