import { AppError } from "../../../shared/errors/app-error";
import { TicketAuditLogsRepository } from "../../auditlogs/repositories/ticket-audit-logs-repository";
import { NotificationsRepository } from "../../notifications/repositories/notifications-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketAlreadyAssignedError } from "../errors/ticket-already-assigned-error";
import { UnauthorizedTicketAssignmentError } from "../errors/unauthorized-ticket-assignment-error";
import { TicketsRepository } from "../repositories/tickets-repository";

export type AssignTicketToSelfUseCaseRequest = {
  ticketId: string;
  userId: string;
};

export type AssignTicketToSelfUseCaseResponse = {
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

export class AssignTicketToSelfUseCase {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly ticketAuditLogsRepository: TicketAuditLogsRepository
  ) {}

  async execute(
    input: AssignTicketToSelfUseCaseRequest
  ): Promise<AssignTicketToSelfUseCaseResponse> {
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

    if (user.departmentId !== ticket.targetDepartmentId) {
      throw new UnauthorizedTicketAssignmentError();
    }

    if (ticket.assignedToUserId) {
      throw new TicketAlreadyAssignedError();
    }

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
      throw new AppError("Resolved or closed tickets cannot be assigned.", 409);
    }

    const assignmentTimestamp = ticket.firstResponseAt ? undefined : new Date();

    const updatedTicket = await this.ticketsRepository.assignToUser({
      ticketId: ticket.id,
      assignedToUserId: user.id,
      status: "IN_PROGRESS",
      ...(assignmentTimestamp ? { firstResponseAt: assignmentTimestamp } : {})
    });

    await this.notificationsRepository.create({
      recipientUserId: ticket.createdByUserId,
      ticketId: ticket.id,
      eventType: "ASSIGNED",
      message: `Ticket \"${ticket.title}\" was assigned to ${user.name}.`
    });

    await this.ticketAuditLogsRepository.create({
      ticketId: ticket.id,
      actorUserId: user.id,
      action: "ASSIGNED",
      fromValue: ticket.assignedToUserId ?? "",
      toValue: user.id,
      metadata: {
        statusFrom: ticket.status,
        statusTo: updatedTicket.status
      }
    });

    if (ticket.status !== updatedTicket.status) {
      await this.ticketAuditLogsRepository.create({
        ticketId: ticket.id,
        actorUserId: user.id,
        action: "STATUS_CHANGED",
        fromValue: ticket.status,
        toValue: updatedTicket.status,
        metadata: {
          reason: "ticket_assigned"
        }
      });
    }

    if (assignmentTimestamp) {
      await this.notificationsRepository.create({
        recipientUserId: user.id,
        ticketId: ticket.id,
        eventType: "UPDATED",
        message: `First response registered for ticket \"${ticket.title}\".`
      });
    }

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
