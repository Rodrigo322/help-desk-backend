import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { PrismaCommentsRepository } from "../repositories/prisma/prisma-comments-repository";
import { ListTicketCommentsUseCase } from "../use-cases/list-ticket-comments-use-case";

export function makeListTicketCommentsUseCase() {
  const commentsRepository = new PrismaCommentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new ListTicketCommentsUseCase(commentsRepository, ticketsRepository);

  return useCase;
}

