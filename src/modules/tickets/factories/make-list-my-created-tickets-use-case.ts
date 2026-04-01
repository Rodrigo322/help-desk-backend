import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { ListMyCreatedTicketsUseCase } from "../use-cases/list-my-created-tickets-use-case";

export function makeListMyCreatedTicketsUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();

  return new ListMyCreatedTicketsUseCase(ticketsRepository);
}
