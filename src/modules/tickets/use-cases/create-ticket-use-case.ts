import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketsRepository } from "../repositories/tickets-repository";

export type CreateTicketUseCaseRequest = {
  title: string;
  description: string;
  priority: TicketPriority;
  userId: string;
};

export type CreateTicketUseCaseResponse = {
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

export class CreateTicketUseCase {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  async execute(input: CreateTicketUseCaseRequest): Promise<CreateTicketUseCaseResponse> {
    const ticket = await this.ticketsRepository.create({
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "OPEN",
      userId: input.userId
    });

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
