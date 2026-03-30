import { AppError } from "../../../shared/errors/app-error";
import { TicketsRepository } from "../../tickets/repositories/tickets-repository";
import { AttachmentsRepository } from "../repositories/attachments-repository";

export type ListTicketAttachmentsUseCaseRequest = {
  ticketId: string;
};

export type ListTicketAttachmentsUseCaseResponse = {
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    ticketId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class ListTicketAttachmentsUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly ticketsRepository: TicketsRepository
  ) {}

  async execute(
    input: ListTicketAttachmentsUseCaseRequest
  ): Promise<ListTicketAttachmentsUseCaseResponse> {
    const ticket = await this.ticketsRepository.findById(input.ticketId);

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    const attachments = await this.attachmentsRepository.findManyByTicketId(input.ticketId);

    return {
      attachments: attachments.map((attachment) => ({
        id: attachment.id,
        fileName: attachment.fileName,
        fileUrl: attachment.fileUrl,
        mimeType: attachment.mimeType,
        ticketId: attachment.ticketId,
        createdAt: attachment.createdAt,
        updatedAt: attachment.updatedAt
      }))
    };
  }
}

