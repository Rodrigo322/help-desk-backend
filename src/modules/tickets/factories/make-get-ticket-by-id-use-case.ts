import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { GetTicketByIdUseCase } from "../use-cases/get-ticket-by-id-use-case";

export function makeGetTicketByIdUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetTicketByIdUseCase(ticketsRepository, usersRepository);

  return useCase;
}
