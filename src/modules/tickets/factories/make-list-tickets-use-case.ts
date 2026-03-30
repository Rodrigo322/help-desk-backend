import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { ListTicketsUseCase } from "../use-cases/list-tickets-use-case";

export function makeListTicketsUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new ListTicketsUseCase(ticketsRepository);

  return useCase;
}

