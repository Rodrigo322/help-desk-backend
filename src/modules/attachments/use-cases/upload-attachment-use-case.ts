import { AppError } from "../../../shared/errors/app-error";
import { TicketsRepository } from "../../tickets/repositories/tickets-repository";
import { AttachmentsRepository } from "../repositories/attachments-repository";

export type UploadAttachmentUseCaseRequest = {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  ticketId: string;
};

export type UploadAttachmentUseCaseResponse = {
  attachment: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    ticketId: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class UploadAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly ticketsRepository: TicketsRepository
  ) {}

  async execute(input: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    const ticket = await this.ticketsRepository.findById(input.ticketId);

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    const attachment = await this.attachmentsRepository.create({
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      mimeType: input.mimeType,
      ticketId: input.ticketId
    });

    return {
      attachment: {
        id: attachment.id,
        fileName: attachment.fileName,
        fileUrl: attachment.fileUrl,
        mimeType: attachment.mimeType,
        ticketId: attachment.ticketId,
        createdAt: attachment.createdAt,
        updatedAt: attachment.updatedAt
      }
    };
  }
}

