import { Prisma, Ticket } from "@prisma/client";

import { prisma } from "../../../../database/prisma";
import {
  CloseTicketRepositoryInput,
  CreateTicketRepositoryInput,
  ListTicketsRepositoryInput,
  ListTicketsRepositoryOutput,
  ResolveTicketRepositoryInput,
  TicketEntity,
  TicketsRepository,
  UpdateTicketPriorityRepositoryInput,
  UpdateTicketAssignmentRepositoryInput
} from "../tickets-repository";

function mapTicket(ticket: Ticket): TicketEntity {
  return {
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
  };
}

function buildFiltersWhere(
  filters: ListTicketsRepositoryInput["filters"]
): Prisma.TicketWhereInput {
  return {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.priority ? { priority: filters.priority } : {})
  };
}

export class PrismaTicketsRepository implements TicketsRepository {
  async create(data: CreateTicketRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        createdByUserId: data.createdByUserId,
        originDepartmentId: data.originDepartmentId,
        targetDepartmentId: data.targetDepartmentId,
        firstResponseDeadlineAt: data.firstResponseDeadlineAt,
        resolutionDeadlineAt: data.resolutionDeadlineAt
      }
    });

    return mapTicket(ticket);
  }

  async findById(ticketId: string): Promise<TicketEntity | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return null;
    }

    return mapTicket(ticket);
  }

  async assignToUser(data: UpdateTicketAssignmentRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.update({
      where: { id: data.ticketId },
      data: {
        assignedToUserId: data.assignedToUserId,
        ...(data.status ? { status: data.status } : {}),
        ...(data.firstResponseAt ? { firstResponseAt: data.firstResponseAt } : {})
      }
    });

    return mapTicket(ticket);
  }

  async resolve(data: ResolveTicketRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.update({
      where: { id: data.ticketId },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
        closedByUserId: data.resolvedByUserId
      }
    });

    return mapTicket(ticket);
  }

  async close(data: CloseTicketRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.update({
      where: { id: data.ticketId },
      data: {
        status: "CLOSED",
        closedByUserId: data.closedByUserId
      }
    });

    return mapTicket(ticket);
  }

  async updatePriority(data: UpdateTicketPriorityRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.update({
      where: { id: data.ticketId },
      data: { priority: data.priority }
    });

    return mapTicket(ticket);
  }

  async listByTargetDepartment(
    departmentId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    const where: Prisma.TicketWhereInput = {
      targetDepartmentId: departmentId,
      ...buildFiltersWhere(data.filters)
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: {
          createdAt: data.orderByCreatedAt ?? "desc"
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize
      }),
      prisma.ticket.count({ where })
    ]);

    return {
      items: tickets.map(mapTicket),
      total
    };
  }

  async listByCreatedByUser(
    userId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    const where: Prisma.TicketWhereInput = {
      createdByUserId: userId,
      ...buildFiltersWhere(data.filters)
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: {
          createdAt: data.orderByCreatedAt ?? "desc"
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize
      }),
      prisma.ticket.count({ where })
    ]);

    return {
      items: tickets.map(mapTicket),
      total
    };
  }

  async listByAssignedToUser(
    userId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    const where: Prisma.TicketWhereInput = {
      assignedToUserId: userId,
      ...buildFiltersWhere(data.filters)
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: {
          createdAt: data.orderByCreatedAt ?? "desc"
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize
      }),
      prisma.ticket.count({ where })
    ]);

    return {
      items: tickets.map(mapTicket),
      total
    };
  }
}
