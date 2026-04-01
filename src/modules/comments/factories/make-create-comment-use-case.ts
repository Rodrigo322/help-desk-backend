import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaCommentsRepository } from "../repositories/prisma/prisma-comments-repository";
import { CreateCommentUseCase } from "../use-cases/create-comment-use-case";

export function makeCreateCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateCommentUseCase(
    commentsRepository,
    ticketsRepository,
    usersRepository
  );

  return useCase;
}
