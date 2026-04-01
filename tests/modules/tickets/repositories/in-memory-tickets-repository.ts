import { randomUUID } from "node:crypto";

import {
  CloseTicketRepositoryInput,
  CreateTicketRepositoryInput,
  ListTicketsRepositoryInput,
  ListTicketsRepositoryOutput,
  ResolveTicketRepositoryInput,
  TicketEntity,
  TicketsRepository,
  UpdateTicketAssignmentRepositoryInput,
  UpdateTicketPriorityRepositoryInput
} from "../../../../src/modules/tickets/repositories/tickets-repository";

export class InMemoryTicketsRepository implements TicketsRepository {
  public items: TicketEntity[] = [];

  async create(data: CreateTicketRepositoryInput): Promise<TicketEntity> {
    const now = new Date();
    const ticket: TicketEntity = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      createdByUserId: data.createdByUserId,
      originDepartmentId: data.originDepartmentId,
      targetDepartmentId: data.targetDepartmentId,
      assignedToUserId: null,
      closedByUserId: null,
      firstResponseAt: null,
      resolvedAt: null,
      firstResponseDeadlineAt: data.firstResponseDeadlineAt,
      resolutionDeadlineAt: data.resolutionDeadlineAt,
      createdAt: now,
      updatedAt: now
    };

    this.items.push(ticket);
    return ticket;
  }

  async findById(ticketId: string): Promise<TicketEntity | null> {
    const ticket = this.items.find((item) => item.id === ticketId);
    return ticket ?? null;
  }

  async assignToUser(data: UpdateTicketAssignmentRepositoryInput): Promise<TicketEntity> {
    const index = this.items.findIndex((item) => item.id === data.ticketId);

    if (index < 0) {
      throw new Error("Ticket not found in fake repository.");
    }

    const updated: TicketEntity = {
      ...this.items[index],
      assignedToUserId: data.assignedToUserId,
      status: data.status ?? this.items[index].status,
      firstResponseAt: data.firstResponseAt ?? this.items[index].firstResponseAt,
      updatedAt: new Date()
    };

    this.items[index] = updated;
    return updated;
  }

  async resolve(data: ResolveTicketRepositoryInput): Promise<TicketEntity> {
    const index = this.items.findIndex((item) => item.id === data.ticketId);

    if (index < 0) {
      throw new Error("Ticket not found in fake repository.");
    }

    const updated: TicketEntity = {
      ...this.items[index],
      status: "RESOLVED",
      resolvedAt: new Date(),
      closedByUserId: data.resolvedByUserId,
      updatedAt: new Date()
    };

    this.items[index] = updated;
    return updated;
  }

  async close(data: CloseTicketRepositoryInput): Promise<TicketEntity> {
    const index = this.items.findIndex((item) => item.id === data.ticketId);

    if (index < 0) {
      throw new Error("Ticket not found in fake repository.");
    }

    const updated: TicketEntity = {
      ...this.items[index],
      status: "CLOSED",
      closedByUserId: data.closedByUserId,
      updatedAt: new Date()
    };

    this.items[index] = updated;
    return updated;
  }

  async updatePriority(data: UpdateTicketPriorityRepositoryInput): Promise<TicketEntity> {
    const index = this.items.findIndex((item) => item.id === data.ticketId);

    if (index < 0) {
      throw new Error("Ticket not found in fake repository.");
    }

    const updated: TicketEntity = {
      ...this.items[index],
      priority: data.priority,
      updatedAt: new Date()
    };

    this.items[index] = updated;
    return updated;
  }

  async listByTargetDepartment(
    departmentId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    return this.listBy("targetDepartmentId", departmentId, data);
  }

  async listByCreatedByUser(
    userId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    return this.listBy("createdByUserId", userId, data);
  }

  async listByAssignedToUser(
    userId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    return this.listBy("assignedToUserId", userId, data);
  }

  private async listBy(
    field: "targetDepartmentId" | "createdByUserId" | "assignedToUserId",
    value: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput> {
    const filtered = this.items
      .filter((ticket) => {
        const scopeMatch = ticket[field] === value;
        const statusMatch = data.filters?.status ? ticket.status === data.filters.status : true;
        const priorityMatch = data.filters?.priority
          ? ticket.priority === data.filters.priority
          : true;

        return scopeMatch && statusMatch && priorityMatch;
      })
      .sort((a, b) => {
        const direction = data.orderByCreatedAt === "asc" ? 1 : -1;
        return direction * (a.createdAt.getTime() - b.createdAt.getTime());
      });

    const start = (data.page - 1) * data.pageSize;
    const end = start + data.pageSize;

    return {
      items: filtered.slice(start, end),
      total: filtered.length
    };
  }
}
