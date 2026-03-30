export type AttachmentEntity = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  ticketId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAttachmentRepositoryInput = {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  ticketId: string;
};

export interface AttachmentsRepository {
  create(data: CreateAttachmentRepositoryInput): Promise<AttachmentEntity>;
  findManyByTicketId(ticketId: string): Promise<AttachmentEntity[]>;
}

