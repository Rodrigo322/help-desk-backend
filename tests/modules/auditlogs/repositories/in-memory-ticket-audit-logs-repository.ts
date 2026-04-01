import { randomUUID } from "node:crypto";

import {
  CreateTicketAuditLogRepositoryInput,
  TicketAuditLogEntity,
  TicketAuditLogsRepository
} from "../../../../src/modules/auditlogs/repositories/ticket-audit-logs-repository";

export class InMemoryTicketAuditLogsRepository implements TicketAuditLogsRepository {
  public items: TicketAuditLogEntity[] = [];

  async create(data: CreateTicketAuditLogRepositoryInput): Promise<TicketAuditLogEntity> {
    const now = new Date();
    const log: TicketAuditLogEntity = {
      id: randomUUID(),
      ticketId: data.ticketId,
      actorUserId: data.actorUserId,
      action: data.action,
      fromValue: data.fromValue ?? null,
      toValue: data.toValue ?? null,
      metadata: data.metadata ?? null,
      createdAt: now,
      updatedAt: now
    };

    this.items.push(log);
    return log;
  }

  async findManyByTicketId(ticketId: string): Promise<TicketAuditLogEntity[]> {
    return this.items.filter((item) => item.ticketId === ticketId);
  }
}
