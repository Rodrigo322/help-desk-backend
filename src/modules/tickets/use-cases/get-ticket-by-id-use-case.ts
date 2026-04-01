import { AppError } from "../../../shared/errors/app-error";
import { UsersRepository } from "../../users/repositories/users-repository";
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
    createdByUserId: string;
    createdByUserName: string;
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
  };
};

export class GetTicketByIdUseCase {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  private canViewTicket(
    ticket: {
      createdByUserId: string;
      assignedToUserId: string | null;
      targetDepartmentId: string;
    },
    user: {
      id: string;
      departmentId: string;
      role: string;
    }
  ) {
    const isCreator = ticket.createdByUserId === user.id;
    const isAssignee = ticket.assignedToUserId === user.id;
    const isTargetDepartmentUser = ticket.targetDepartmentId === user.departmentId;
    const isAdmin = user.role === "ADMIN";

    return isCreator || isAssignee || isTargetDepartmentUser || isAdmin;
  }

  async execute(input: GetTicketByIdUseCaseRequest): Promise<GetTicketByIdUseCaseResponse> {
    const [ticket, user] = await Promise.all([
      this.ticketsRepository.findById(input.ticketId),
      this.usersRepository.findById(input.userId)
    ]);

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (!this.canViewTicket(ticket, user)) {
      throw new AppError("Unauthorized.", 403);
    }

    const requester = await this.usersRepository.findById(ticket.createdByUserId);

    if (!requester) {
      throw new AppError("Requester not found.", 404);
    }

    return {
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        createdByUserId: ticket.createdByUserId,
        createdByUserName: requester.name,
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
      }
    };
  }
}
