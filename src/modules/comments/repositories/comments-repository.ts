export type CommentAuthorEntity = {
  id: string;
  name: string;
  email: string;
};

export type CommentEntity = {
  id: string;
  content: string;
  ticketId: string;
  userId: string;
  author: CommentAuthorEntity;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCommentRepositoryInput = {
  content: string;
  ticketId: string;
  userId: string;
};

export interface CommentsRepository {
  create(data: CreateCommentRepositoryInput): Promise<CommentEntity>;
  findManyByTicketId(ticketId: string): Promise<CommentEntity[]>;
}

