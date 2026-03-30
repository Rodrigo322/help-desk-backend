import { AppError } from "../../../shared/errors/app-error";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketsRepository } from "../repositories/tickets-repository";

export type GetTicketByIdUseCaseRequest = {
  ticketId: string;
  userId: string;
};

export type GetTicketByIdUseCaseResponse = {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class GetTicketByIdUseCase {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  async execute(input: GetTicketByIdUseCaseRequest): Promise<GetTicketByIdUseCaseResponse> {
    const ticket = await this.ticketsRepository.findByIdAndUserId({
      ticketId: input.ticketId,
      userId: input.userId
    });

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    return {
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        userId: ticket.userId,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    };
  }
}
