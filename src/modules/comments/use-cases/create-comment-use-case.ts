import { AppError } from "../../../shared/errors/app-error";
import { TicketsRepository } from "../../tickets/repositories/tickets-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { CommentsRepository } from "../repositories/comments-repository";

export type CreateCommentUseCaseRequest = {
  content: string;
  isInternal?: boolean;
  ticketId: string;
  userId: string;
};

export type CreateCommentUseCaseResponse = {
  comment: {
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
  };
};

export class CreateCommentUseCase {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(input: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
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

    if (input.isInternal && user.role === "EMPLOYEE") {
      throw new AppError("Only managers/admins can create internal comments.", 403);
    }

    const comment = await this.commentsRepository.create({
      content: input.content,
      isInternal: input.isInternal ?? false,
      ticketId: input.ticketId,
      userId: input.userId
    });

    return {
      comment: {
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
      }
    };
  }
}
