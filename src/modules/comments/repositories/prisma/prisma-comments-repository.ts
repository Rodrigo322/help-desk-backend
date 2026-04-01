import { Comment, User } from "@prisma/client";

import { prisma } from "../../../../database/prisma";
import {
  CommentEntity,
  CommentsRepository,
  CreateCommentRepositoryInput
} from "../comments-repository";

type CommentWithAuthor = Comment & {
  user: Pick<User, "id" | "name" | "email">;
};

export class PrismaCommentsRepository implements CommentsRepository {
  async create(data: CreateCommentRepositoryInput): Promise<CommentEntity> {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        isInternal: data.isInternal,
        ticketId: data.ticketId,
        userId: data.userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return {
      id: comment.id,
      content: comment.content,
      isInternal: comment.isInternal,
      ticketId: comment.ticketId,
      userId: comment.userId,
      author: {
        id: comment.user.id,
        name: comment.user.name,
        email: comment.user.email
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    };
  }

  async findManyByTicketId(ticketId: string, includeInternal: boolean): Promise<CommentEntity[]> {
    const comments = await prisma.comment.findMany({
      where: {
        ticketId,
        ...(includeInternal ? {} : { isInternal: false })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return comments.map((comment: CommentWithAuthor) => ({
      id: comment.id,
      content: comment.content,
      isInternal: comment.isInternal,
      ticketId: comment.ticketId,
      userId: comment.userId,
      author: {
        id: comment.user.id,
        name: comment.user.name,
        email: comment.user.email
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }));
  }
}
