import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { ListDepartmentTicketsUseCase } from "../use-cases/list-department-tickets-use-case";

export function makeListDepartmentTicketsUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();

  return new ListDepartmentTicketsUseCase(ticketsRepository, usersRepository);
}
