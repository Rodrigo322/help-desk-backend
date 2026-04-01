import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaCommentsRepository } from "../repositories/prisma/prisma-comments-repository";
import { ListTicketCommentsUseCase } from "../use-cases/list-ticket-comments-use-case";

export function makeListTicketCommentsUseCase() {
  const commentsRepository = new PrismaCommentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new ListTicketCommentsUseCase(
    commentsRepository,
    ticketsRepository,
    usersRepository
  );

  return useCase;
}
