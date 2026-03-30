import { randomUUID } from "node:crypto";

import {
  CreateTicketRepositoryInput,
  FindByIdAndUserIdRepositoryInput,
  ListTicketsRepositoryInput,
  ListTicketsRepositoryOutput,
  TicketEntity,
  TicketsRepository,
  UpdateTicketStatusRepositoryInput
} from "../../../../src/modules/tickets/repositories/tickets-repository";

export class InMemoryTicketsRepository implements TicketsRepository {
  public items: TicketEntity[] = [];

  async create(data: CreateTicketRepositoryInput): Promise<TicketEntity> {
    const ticket: TicketEntity = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.push(ticket);

    return ticket;
  }

  async list(data: ListTicketsRepositoryInput): Promise<ListTicketsRepositoryOutput> {
    const filtered = this.items
      .filter((ticket) => {
        const statusMatch = data.filters?.status ? ticket.status === data.filters.status : true;
        const priorityMatch = data.filters?.priority
          ? ticket.priority === data.filters.priority
          : true;
        const userIdMatch = data.filters?.userId ? ticket.userId === data.filters.userId : true;

        return statusMatch && priorityMatch && userIdMatch;
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

  async findById(ticketId: string): Promise<TicketEntity | null> {
    const ticket = this.items.find((item) => item.id === ticketId);
    return ticket ?? null;
  }

  async findByIdAndUserId(data: FindByIdAndUserIdRepositoryInput): Promise<TicketEntity | null> {
    const ticket = this.items.find(
      (item) => item.id === data.ticketId && item.userId === data.userId
    );

    return ticket ?? null;
  }

  async updateStatus(data: UpdateTicketStatusRepositoryInput): Promise<TicketEntity> {
    const ticketIndex = this.items.findIndex((item) => item.id === data.ticketId);

    if (ticketIndex < 0) {
      throw new Error("Ticket not found in fake repository.");
    }

    const updatedTicket: TicketEntity = {
      ...this.items[ticketIndex],
      status: data.status,
      updatedAt: new Date()
    };

    this.items[ticketIndex] = updatedTicket;

    return updatedTicket;
  }
}

