import { prisma } from "../../../../database/prisma";
import {
  CommentEntity,
  CommentsRepository,
  CreateCommentRepositoryInput
} from "../comments-repository";

export class PrismaCommentsRepository implements CommentsRepository {
  async create(data: CreateCommentRepositoryInput): Promise<CommentEntity> {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
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

  async findManyByTicketId(ticketId: string): Promise<CommentEntity[]> {
    const comments = await prisma.comment.findMany({
      where: { ticketId },
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

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
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

