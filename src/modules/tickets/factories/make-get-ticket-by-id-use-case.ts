import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { GetTicketByIdUseCase } from "../use-cases/get-ticket-by-id-use-case";

export function makeGetTicketByIdUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new GetTicketByIdUseCase(ticketsRepository);

  return useCase;
}

