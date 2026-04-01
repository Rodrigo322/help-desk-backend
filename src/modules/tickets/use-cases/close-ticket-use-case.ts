import { AppError } from "../../../shared/errors/app-error";
import { TicketAuditLogsRepository } from "../../auditlogs/repositories/ticket-audit-logs-repository";
import { NotificationsRepository } from "../../notifications/repositories/notifications-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { UnauthorizedTicketCloseError } from "../errors/unauthorized-ticket-close-error";
import { TicketsRepository } from "../repositories/tickets-repository";

export type CloseTicketUseCaseRequest = {
  ticketId: string;
  userId: string;
};

export type CloseTicketUseCaseResponse = {
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

export class CloseTicketUseCase {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly ticketAuditLogsRepository: TicketAuditLogsRepository
  ) {}

  private canCloseTicket(ticketAssignedToUserId: string | null, user: { id: string; role: string; departmentId: string }, targetDepartmentId: string): boolean {
    const isAssignedUser = ticketAssignedToUserId === user.id;
    const isManagerFromTargetDepartment =
      user.role === "MANAGER" && user.departmentId === targetDepartmentId;
    const isAdmin = user.role === "ADMIN";

    return isAssignedUser || isManagerFromTargetDepartment || isAdmin;
  }

  async execute(input: CloseTicketUseCaseRequest): Promise<CloseTicketUseCaseResponse> {
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

    if (!this.canCloseTicket(ticket.assignedToUserId, user, ticket.targetDepartmentId)) {
      throw new UnauthorizedTicketCloseError();
    }

    if (ticket.status === "CLOSED") {
      throw new AppError("Ticket is already closed.", 409);
    }

    if (ticket.status !== "RESOLVED") {
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

    const updatedTicket = await this.ticketsRepository.close({
      ticketId: ticket.id,
      closedByUserId: user.id
    });

    await this.ticketAuditLogsRepository.create({
      ticketId: ticket.id,
      actorUserId: user.id,
      action: "STATUS_CHANGED",
      fromValue: "RESOLVED",
      toValue: "CLOSED",
      metadata: {
        reason: "ticket_closed"
      }
    });

    await this.notificationsRepository.create({
      recipientUserId: ticket.createdByUserId,
      ticketId: ticket.id,
      eventType: "UPDATED",
      message: `Ticket \"${ticket.title}\" was closed by ${user.name}.`
    });

    return {
      ticket: {
        id: updatedTicket.id,
        title: updatedTicket.title,
        description: updatedTicket.description,
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        createdByUserId: updatedTicket.createdByUserId,
        originDepartmentId: updatedTicket.originDepartmentId,
        targetDepartmentId: updatedTicket.targetDepartmentId,
        assignedToUserId: updatedTicket.assignedToUserId,
        closedByUserId: updatedTicket.closedByUserId,
        firstResponseAt: updatedTicket.firstResponseAt,
        resolvedAt: updatedTicket.resolvedAt,
        firstResponseDeadlineAt: updatedTicket.firstResponseDeadlineAt,
        resolutionDeadlineAt: updatedTicket.resolutionDeadlineAt,
        createdAt: updatedTicket.createdAt,
        updatedAt: updatedTicket.updatedAt
      }
    };
  }
}
