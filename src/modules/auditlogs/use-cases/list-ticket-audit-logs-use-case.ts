import { AppError } from "../../../shared/errors/app-error";
import { TicketsRepository } from "../../tickets/repositories/tickets-repository";
import { TicketAuditLogsRepository } from "../repositories/ticket-audit-logs-repository";

export type ListTicketAuditLogsUseCaseRequest = {
  ticketId: string;
};

export type ListTicketAuditLogsUseCaseResponse = {
  auditLogs: Array<{
    id: string;
    ticketId: string;
    actorUserId: string;
    action: string;
    fromValue: string | null;
    toValue: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export class ListTicketAuditLogsUseCase {
  constructor(
    private readonly ticketAuditLogsRepository: TicketAuditLogsRepository,
    private readonly ticketsRepository: TicketsRepository
  ) {}

  async execute(
    input: ListTicketAuditLogsUseCaseRequest
  ): Promise<ListTicketAuditLogsUseCaseResponse> {
    const ticket = await this.ticketsRepository.findById(input.ticketId);

    if (!ticket) {
      throw new AppError("Ticket not found.", 404);
    }

    const auditLogs = await this.ticketAuditLogsRepository.findManyByTicketId(input.ticketId);

    return {
      auditLogs: auditLogs.map((auditLog) => ({
        id: auditLog.id,
        ticketId: auditLog.ticketId,
        actorUserId: auditLog.actorUserId,
        action: auditLog.action,
        fromValue: auditLog.fromValue,
        toValue: auditLog.toValue,
        metadata: auditLog.metadata,
        createdAt: auditLog.createdAt,
        updatedAt: auditLog.updatedAt
      }))
    };
  }
}
