export type Comment = {
  id: string;
  content: string;
  ticketId: string;
  userId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ListTicketCommentsResponse = {
  comments: Comment[];
};

export type CreateCommentResponse = {
  comment: Comment;
};

