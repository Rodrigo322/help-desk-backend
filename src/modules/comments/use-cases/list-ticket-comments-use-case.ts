import { AppError } from "../../../shared/errors/app-error";
import { TicketsRepository } from "../../tickets/repositories/tickets-repository";
import { CommentsRepository } from "../repositories/comments-repository";

export type ListTicketCommentsUseCaseRequest = {
  ticketId: string;
};

export type ListTicketCommentsUseCaseResponse = {
  comments: Array<{
    id: string;
    content: string;
    ticketId: string;
    userId: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class ListTicketCommentsUseCase {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly ticketsRepository: TicketsRepository
  ) {}

  async execute(
    input: ListTicketCommentsUseCaseRequest
  ): Promise<ListTicketCommentsUseCaseResponse> {
    const ticket = await this.ticketsRepository.findById(input.ticketId);

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    const comments = await this.commentsRepository.findManyByTicketId(input.ticketId);

    return {
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        ticketId: comment.ticketId,
        userId: comment.userId,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          email: comment.author.email
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      }))
    };
  }
}

