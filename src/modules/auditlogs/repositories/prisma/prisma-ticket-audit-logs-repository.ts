import { Prisma } from "@prisma/client";

import { prisma } from "../../../../database/prisma";
import {
  CreateTicketAuditLogRepositoryInput,
  TicketAuditLogEntity,
  TicketAuditLogsRepository
} from "../ticket-audit-logs-repository";

export class PrismaTicketAuditLogsRepository implements TicketAuditLogsRepository {
  async create(data: CreateTicketAuditLogRepositoryInput): Promise<TicketAuditLogEntity> {
    const auditLog = await prisma.ticketAuditLog.create({
      data: {
        ticketId: data.ticketId,
        actorUserId: data.actorUserId,
        action: data.action,
        ...(data.fromValue ? { fromValue: data.fromValue } : {}),
        ...(data.toValue ? { toValue: data.toValue } : {}),
        ...(data.metadata
          ? { metadata: data.metadata as Prisma.InputJsonValue }
          : {})
      }
    });

    return {
      id: auditLog.id,
      ticketId: auditLog.ticketId,
      actorUserId: auditLog.actorUserId,
      action: auditLog.action,
      fromValue: auditLog.fromValue,
      toValue: auditLog.toValue,
      metadata: (auditLog.metadata as Record<string, unknown> | null) ?? null,
      createdAt: auditLog.createdAt,
      updatedAt: auditLog.updatedAt
    };
  }

  async findManyByTicketId(ticketId: string): Promise<TicketAuditLogEntity[]> {
    const auditLogs = await prisma.ticketAuditLog.findMany({
      where: {
        ticketId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return auditLogs.map((auditLog) => ({
      id: auditLog.id,
      ticketId: auditLog.ticketId,
      actorUserId: auditLog.actorUserId,
      action: auditLog.action,
      fromValue: auditLog.fromValue,
      toValue: auditLog.toValue,
      metadata: (auditLog.metadata as Record<string, unknown> | null) ?? null,
      createdAt: auditLog.createdAt,
      updatedAt: auditLog.updatedAt
    }));
  }
}
