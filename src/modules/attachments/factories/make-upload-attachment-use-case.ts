import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { PrismaAttachmentsRepository } from "../repositories/prisma/prisma-attachments-repository";
import { UploadAttachmentUseCase } from "../use-cases/upload-attachment-use-case";

export function makeUploadAttachmentUseCase() {
  const attachmentsRepository = new PrismaAttachmentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new UploadAttachmentUseCase(attachmentsRepository, ticketsRepository);

  return useCase;
}

