import { AppError } from "../../../shared/errors/app-error";
import { TicketAuditLogsRepository } from "../../auditlogs/repositories/ticket-audit-logs-repository";
import { NotificationsRepository } from "../../notifications/repositories/notifications-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { UnauthorizedTicketCloseError } from "../errors/unauthorized-ticket-close-error";
import { TicketsRepository } from "../repositories/tickets-repository";

export type ResolveTicketUseCaseRequest = {
  ticketId: string;
  userId: string;
};

export type ResolveTicketUseCaseResponse = {
  ticket: {
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
  };
};

export class ResolveTicketUseCase {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly ticketAuditLogsRepository: TicketAuditLogsRepository
  ) {}

  private canResolveTicket(
    ticketAssignedToUserId: string | null,
    user: { id: string; role: string; departmentId: string },
    targetDepartmentId: string
  ): boolean {
    const isAssignedUser = ticketAssignedToUserId === user.id;
    const isManagerFromTargetDepartment =
      user.role === "MANAGER" && user.departmentId === targetDepartmentId;
    const isAdmin = user.role === "ADMIN";

    return isAssignedUser || isManagerFromTargetDepartment || isAdmin;
  }

  async execute(input: ResolveTicketUseCaseRequest): Promise<ResolveTicketUseCaseResponse> {
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

    if (!this.canResolveTicket(ticket.assignedToUserId, user, ticket.targetDepartmentId)) {
      throw new UnauthorizedTicketCloseError();
    }

    if (ticket.status === "RESOLVED") {
      throw new AppError("Ticket is already resolved.", 409);
    }

    if (ticket.status === "CLOSED") {
      throw new AppError("Closed tickets cannot be resolved again.", 409);
    }

    const resolvedTicket = await this.ticketsRepository.resolve({
      ticketId: ticket.id,
      resolvedByUserId: user.id
    });

    await this.ticketAuditLogsRepository.create({
      ticketId: ticket.id,
      actorUserId: user.id,
      action: "STATUS_CHANGED",
      fromValue: ticket.status,
      toValue: "RESOLVED",
      metadata: {
        reason: "ticket_resolved"
      }
    });

    await this.notificationsRepository.create({
      recipientUserId: ticket.createdByUserId,
      ticketId: ticket.id,
      eventType: "UPDATED",
      message: `Ticket \"${ticket.title}\" was resolved by ${user.name}.`
    });

    return {
      ticket: {
        id: resolvedTicket.id,
        title: resolvedTicket.title,
        description: resolvedTicket.description,
        status: resolvedTicket.status,
        priority: resolvedTicket.priority,
        createdByUserId: resolvedTicket.createdByUserId,
        originDepartmentId: resolvedTicket.originDepartmentId,
        targetDepartmentId: resolvedTicket.targetDepartmentId,
        assignedToUserId: resolvedTicket.assignedToUserId,
        closedByUserId: resolvedTicket.closedByUserId,
        firstResponseAt: resolvedTicket.firstResponseAt,
        resolvedAt: resolvedTicket.resolvedAt,
        firstResponseDeadlineAt: resolvedTicket.firstResponseDeadlineAt,
        resolutionDeadlineAt: resolvedTicket.resolutionDeadlineAt,
        createdAt: resolvedTicket.createdAt,
        updatedAt: resolvedTicket.updatedAt
      }
    };
  }
}
