import { Attachment } from "@prisma/client";

import { prisma } from "../../../../database/prisma";
import {
  AttachmentEntity,
  AttachmentsRepository,
  CreateAttachmentRepositoryInput
} from "../attachments-repository";

export class PrismaAttachmentsRepository implements AttachmentsRepository {
  async create(data: CreateAttachmentRepositoryInput): Promise<AttachmentEntity> {
    const attachment = await prisma.attachment.create({
      data: {
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        mimeType: data.mimeType,
        ticketId: data.ticketId
      }
    });

    return {
      id: attachment.id,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      mimeType: attachment.mimeType,
      ticketId: attachment.ticketId,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt
    };
  }

  async findManyByTicketId(ticketId: string): Promise<AttachmentEntity[]> {
    const attachments = await prisma.attachment.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" }
    });

    return attachments.map((attachment: Attachment) => ({
      id: attachment.id,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      mimeType: attachment.mimeType,
      ticketId: attachment.ticketId,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt
    }));
  }
}
