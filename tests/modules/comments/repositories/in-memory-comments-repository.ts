import { randomUUID } from "node:crypto";

import {
  CommentEntity,
  CommentsRepository,
  CreateCommentRepositoryInput
} from "../../../../src/modules/comments/repositories/comments-repository";
import { InMemoryUsersRepository } from "../../users/repositories/in-memory-users-repository";

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: CommentEntity[] = [];

  constructor(private readonly usersRepository: InMemoryUsersRepository) {}

  async create(data: CreateCommentRepositoryInput): Promise<CommentEntity> {
    const author = this.usersRepository.items.find((user) => user.id === data.userId);

    if (!author) {
      throw new Error("Author not found in fake repository.");
    }

    const comment: CommentEntity = {
      id: randomUUID(),
      content: data.content,
      isInternal: data.isInternal,
      ticketId: data.ticketId,
      userId: data.userId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.push(comment);

    return comment;
  }

  async findManyByTicketId(ticketId: string, includeInternal: boolean): Promise<CommentEntity[]> {
    return this.items.filter(
      (item) => item.ticketId === ticketId && (includeInternal ? true : !item.isInternal)
    );
  }
}
