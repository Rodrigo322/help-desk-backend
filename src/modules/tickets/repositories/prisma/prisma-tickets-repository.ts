import { prisma } from "../../../../database/prisma";
import {
  CreateTicketRepositoryInput,
  FindByIdAndUserIdRepositoryInput,
  ListTicketsRepositoryInput,
  ListTicketsRepositoryOutput,
  TicketEntity,
  TicketsRepository,
  UpdateTicketStatusRepositoryInput
} from "../tickets-repository";

export class PrismaTicketsRepository implements TicketsRepository {
  async create(data: CreateTicketRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        userId: data.userId
      }
    });

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    };
  }

  async list(data: ListTicketsRepositoryInput): Promise<ListTicketsRepositoryOutput> {
    const where = {
      ...(data.filters?.status ? { status: data.filters.status } : {}),
      ...(data.filters?.priority ? { priority: data.filters.priority } : {}),
      ...(data.filters?.userId ? { userId: data.filters.userId } : {})
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
      items: tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        userId: ticket.userId,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      })),
      total
    };
  }

  async findById(ticketId: string): Promise<TicketEntity | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return null;
    }

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    };
  }

  async findByIdAndUserId(
    data: FindByIdAndUserIdRepositoryInput
  ): Promise<TicketEntity | null> {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: data.ticketId,
        userId: data.userId
      }
    });

    if (!ticket) {
      return null;
    }

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    };
  }

  async updateStatus(data: UpdateTicketStatusRepositoryInput): Promise<TicketEntity> {
    const ticket = await prisma.ticket.update({
      where: { id: data.ticketId },
      data: { status: data.status }
    });

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      userId: ticket.userId,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    };
  }
}
