import { AppError } from "../../../shared/errors/app-error";
import { TicketAuditLogsRepository } from "../../auditlogs/repositories/ticket-audit-logs-repository";
import { DepartmentsRepository } from "../../departments/repositories/departments-repository";
import { NotificationsRepository } from "../../notifications/repositories/notifications-repository";
import { UsersRepository } from "../../users/repositories/users-repository";
import { TicketPriority, TicketStatus } from "../entities/ticket";
import { DepartmentManagerNotFoundError } from "../errors/department-manager-not-found-error";
import { TicketsRepository } from "../repositories/tickets-repository";
import { buildTicketSlaDeadlines } from "../utils/sla-policy";

export type CreateTicketUseCaseRequest = {
  title: string;
  description: string;
  priority: TicketPriority;
  targetDepartmentId: string;
  createdByUserId: string;
};

export type CreateTicketUseCaseResponse = {
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

export class CreateTicketUseCase {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly ticketAuditLogsRepository: TicketAuditLogsRepository
  ) {}

  async execute(input: CreateTicketUseCaseRequest): Promise<CreateTicketUseCaseResponse> {
    const author = await this.usersRepository.findById(input.createdByUserId);

    if (!author) {
      throw new AppError("User not found.", 404);
    }

    if (!author.isActive) {
      throw new AppError("User is inactive.", 403);
    }

    const targetDepartment = await this.departmentsRepository.findById(input.targetDepartmentId);

    if (!targetDepartment) {
      throw new AppError("Target department not found.", 404);
    }

    if (!targetDepartment.isActive) {
      throw new AppError("Target department is inactive.", 409);
    }

    if (!targetDepartment.managerUserId) {
      throw new DepartmentManagerNotFoundError(targetDepartment.id);
    }

    const { firstResponseDeadlineAt, resolutionDeadlineAt } = buildTicketSlaDeadlines(
      input.priority
    );

    const ticket = await this.ticketsRepository.create({
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "NEW",
      createdByUserId: author.id,
      originDepartmentId: author.departmentId,
      targetDepartmentId: targetDepartment.id,
      firstResponseDeadlineAt,
      resolutionDeadlineAt
    });

    await this.notificationsRepository.create({
      recipientUserId: targetDepartment.managerUserId,
      ticketId: ticket.id,
      eventType: "CREATED",
      message: `New ticket \"${ticket.title}\" was opened for your department.`
    });

    await this.notificationsRepository.create({
      recipientUserId: author.id,
      ticketId: ticket.id,
      eventType: "CREATED",
      message: `Ticket \"${ticket.title}\" created and sent to ${targetDepartment.name}.`
    });

    await this.ticketAuditLogsRepository.create({
      ticketId: ticket.id,
      actorUserId: author.id,
      action: "STATUS_CHANGED",
      fromValue: "",
      toValue: ticket.status,
      metadata: {
        reason: "ticket_created"
      }
    });

    return {
      ticket: {
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
      }
    };
  }
}
