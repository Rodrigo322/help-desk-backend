import { AppError } from "../../../shared/errors/app-error";
import { TicketAuditLogsRepository } from "../../auditlogs/repositories/ticket-audit-logs-repository";
import { NotificationsRepository } from "../../notifications/repositories/notifications-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { TicketsRepository } from "../repositories/tickets-repository";

export type UpdateTicketPriorityUseCaseRequest = {
  ticketId: string;
  userId: string;
  priority: TicketPriority;
};

export type UpdateTicketPriorityUseCaseResponse = {
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

export class UpdateTicketPriorityUseCase {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly ticketAuditLogsRepository: TicketAuditLogsRepository
  ) {}

  private canUpdatePriority(
    ticket: { assignedToUserId: string | null; targetDepartmentId: string },
    user: { id: string; role: string; departmentId: string }
  ) {
    const isAssignedUser = ticket.assignedToUserId === user.id;
    const isManagerFromTargetDepartment =
      user.role === "MANAGER" && user.departmentId === ticket.targetDepartmentId;
    const isAdmin = user.role === "ADMIN";

    return isAssignedUser || isManagerFromTargetDepartment || isAdmin;
  }

  async execute(
    input: UpdateTicketPriorityUseCaseRequest
  ): Promise<UpdateTicketPriorityUseCaseResponse> {
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

    if (!this.canUpdatePriority(ticket, user)) {
      throw new AppError("Unauthorized priority update.", 403);
    }

    if (ticket.priority === input.priority) {
      throw new AppError("Ticket already has this priority.", 409);
    }

    const updatedTicket = await this.ticketsRepository.updatePriority({
      ticketId: ticket.id,
      priority: input.priority
    });

    await this.ticketAuditLogsRepository.create({
      ticketId: ticket.id,
      actorUserId: user.id,
      action: "PRIORITY_CHANGED",
      fromValue: ticket.priority,
      toValue: updatedTicket.priority
    });

    await this.notificationsRepository.create({
      recipientUserId: ticket.createdByUserId,
      ticketId: ticket.id,
      eventType: "UPDATED",
      message: `Ticket \"${ticket.title}\" priority changed from ${ticket.priority} to ${updatedTicket.priority}.`
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
