import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketsRepository } from "../repositories/tickets-repository";

export type ListMyCreatedTicketsUseCaseRequest = {
  userId: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  page: number;
  pageSize: number;
};

export type ListMyCreatedTicketsUseCaseResponse = {
  items: Array<{
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdByUserId: string;
    originDepartmentId: string;
    targetDepartmentId: string;
    assignedToUserId: string | null;
    closedByUserId: string | null;
    firstResponseAt: Date | null;
    resolvedAt: Date | null;
    firstResponseDeadlineAt: Date | null;
    resolutionDeadlineAt: Date | null;
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

export class ListMyCreatedTicketsUseCase {
  constructor(private readonly ticketsRepository: TicketsRepository) {}

  async execute(
    input: ListMyCreatedTicketsUseCaseRequest
  ): Promise<ListMyCreatedTicketsUseCaseResponse> {
    const { items, total } = await this.ticketsRepository.listByCreatedByUser(input.userId, {
      filters: {
        status: input.status,
        priority: input.priority
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
        createdByUserId: ticket.createdByUserId,
        originDepartmentId: ticket.originDepartmentId,
        targetDepartmentId: ticket.targetDepartmentId,
        assignedToUserId: ticket.assignedToUserId,
        closedByUserId: ticket.closedByUserId,
        firstResponseAt: ticket.firstResponseAt,
        resolvedAt: ticket.resolvedAt,
        firstResponseDeadlineAt: ticket.firstResponseDeadlineAt,
        resolutionDeadlineAt: ticket.resolutionDeadlineAt,
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
