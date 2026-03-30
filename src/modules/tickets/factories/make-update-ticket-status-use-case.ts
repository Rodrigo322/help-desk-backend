import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { UpdateTicketStatusUseCase } from "../use-cases/update-ticket-status-use-case";

export function makeUpdateTicketStatusUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new UpdateTicketStatusUseCase(ticketsRepository);

  return useCase;
}

