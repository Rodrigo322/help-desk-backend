import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { CreateTicketUseCase } from "../use-cases/create-ticket-use-case";

export function makeCreateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new CreateTicketUseCase(ticketsRepository);

  return useCase;
}

