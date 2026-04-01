import { AppError } from "../../../shared/errors/app-error";
import { TicketsRepository } from "../../tickets/repositories/tickets-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { CommentsRepository } from "../repositories/comments-repository";

export type ListTicketCommentsUseCaseRequest = {
  ticketId: string;
  userId: string;
  includeInternal?: boolean;
};

export type ListTicketCommentsUseCaseResponse = {
  comments: Array<{
    id: string;
    content: string;
    isInternal: boolean;
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
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    input: ListTicketCommentsUseCaseRequest
  ): Promise<ListTicketCommentsUseCaseResponse> {
    const [ticket, user] = await Promise.all([
      this.ticketsRepository.findById(input.ticketId),
      this.usersRepository.findById(input.userId)
    ]);

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const includeInternal = input.includeInternal && user.role !== "EMPLOYEE";

    const comments = await this.commentsRepository.findManyByTicketId(
      input.ticketId,
      Boolean(includeInternal)
    );

    return {
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        isInternal: comment.isInternal,
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
