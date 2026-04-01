import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { ListMyAssignedTicketsUseCase } from "../use-cases/list-my-assigned-tickets-use-case";

export function makeListMyAssignedTicketsUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();

  return new ListMyAssignedTicketsUseCase(ticketsRepository);
}
