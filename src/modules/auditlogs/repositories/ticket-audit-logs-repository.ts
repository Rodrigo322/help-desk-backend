import { TicketAuditLogAction } from "@prisma/client";

export type TicketAuditLogEntity = {
  id: string;
  ticketId: string;
  actorUserId: string;
  action: TicketAuditLogAction;
  fromValue: string | null;
  toValue: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTicketAuditLogRepositoryInput = {
  ticketId: string;
  actorUserId: string;
  action: TicketAuditLogAction;
  fromValue?: string;
  toValue?: string;
  metadata?: Record<string, unknown>;
};

export interface TicketAuditLogsRepository {
  create(data: CreateTicketAuditLogRepositoryInput): Promise<TicketAuditLogEntity>;
  findManyByTicketId(ticketId: string): Promise<TicketAuditLogEntity[]>;
}
