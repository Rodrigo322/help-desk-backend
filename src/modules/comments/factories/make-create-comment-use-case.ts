import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { PrismaCommentsRepository } from "../repositories/prisma/prisma-comments-repository";
import { CreateCommentUseCase } from "../use-cases/create-comment-use-case";

export function makeCreateCommentUseCase() {
  const commentsRepository = new PrismaCommentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new CreateCommentUseCase(commentsRepository, ticketsRepository);

  return useCase;
}

