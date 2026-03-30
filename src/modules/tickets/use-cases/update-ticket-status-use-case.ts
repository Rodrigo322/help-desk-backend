import { AppError } from "../../../shared/errors/app-error";
import { InvalidTicketStatusTransitionError } from "../errors/invalid-ticket-status-transition-error";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketsRepository } from "../repositories/tickets-repository";

export type UpdateTicketStatusUseCaseRequest = {
  ticketId: string;
  userId: string;
  status: TicketStatus;
};

export type UpdateTicketStatusUseCaseResponse = {
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

export class UpdateTicketStatusUseCase {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  private readonly allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
    OPEN: ["IN_PROGRESS", "CLOSED"],
    IN_PROGRESS: ["CLOSED"],
    CLOSED: []
  };

  private validateTransition(currentStatus: TicketStatus, nextStatus: TicketStatus) {
    const allowedNextStatuses = this.allowedTransitions[currentStatus];
    const isValid = allowedNextStatuses.includes(nextStatus);

    if (!isValid) {
      throw new InvalidTicketStatusTransitionError(currentStatus, nextStatus);
    }
  }

  async execute(
    input: UpdateTicketStatusUseCaseRequest
  ): Promise<UpdateTicketStatusUseCaseResponse> {
    const ticket = await this.ticketsRepository.findByIdAndUserId({
      ticketId: input.ticketId,
      userId: input.userId
    });

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    this.validateTransition(ticket.status, input.status);

    const updatedTicket = await this.ticketsRepository.updateStatus({
      ticketId: input.ticketId,
      status: input.status
    });

    return {
      ticket: {
        id: updatedTicket.id,
        title: updatedTicket.title,
        description: updatedTicket.description,
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        userId: updatedTicket.userId,
        createdAt: updatedTicket.createdAt,
        updatedAt: updatedTicket.updatedAt
      }
    };
  }
}
