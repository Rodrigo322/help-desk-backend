import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketsRepository } from "../repositories/tickets-repository";

export type ListTicketsUseCaseRequest = {
  authenticatedUserId: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  userId?: string;
  page: number;
  pageSize: number;
};

export type ListTicketsUseCaseResponse = {
  items: Array<{
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export class ListTicketsUseCase {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  async execute(input: ListTicketsUseCaseRequest): Promise<ListTicketsUseCaseResponse> {
    const effectiveUserId = input.userId ?? input.authenticatedUserId;

    const { items, total } = await this.ticketsRepository.list({
      filters: {
        status: input.status,
        priority: input.priority,
        userId: effectiveUserId
      },
      page: input.page,
      pageSize: input.pageSize,
      orderByCreatedAt: "desc"
    });

    const totalPages = total === 0 ? 0 : Math.ceil(total / input.pageSize);

    return {
      items: items.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        userId: ticket.userId,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      })),
      meta: {
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages
      }
    };
  }
}
