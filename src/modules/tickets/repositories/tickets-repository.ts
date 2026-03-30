import { TicketPriority, TicketStatus } from "../entities/ticket";

export type TicketEntity = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTicketRepositoryInput = {
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  userId: string;
};

export type FindByIdAndUserIdRepositoryInput = {
  ticketId: string;
  userId: string;
};

export type UpdateTicketStatusRepositoryInput = {
  ticketId: string;
  status: TicketStatus;
};

export type ListTicketsRepositoryFilters = {
  status?: TicketStatus;
  priority?: TicketPriority;
  userId?: string;
};

export type ListTicketsRepositoryInput = {
  filters?: ListTicketsRepositoryFilters;
  page: number;
  pageSize: number;
  orderByCreatedAt?: "asc" | "desc";
};

export type ListTicketsRepositoryOutput = {
  items: TicketEntity[];
  total: number;
};

export interface TicketsRepository {
  create(data: CreateTicketRepositoryInput): Promise<TicketEntity>;
  list(data: ListTicketsRepositoryInput): Promise<ListTicketsRepositoryOutput>;
  findById(ticketId: string): Promise<TicketEntity | null>;
  findByIdAndUserId(data: FindByIdAndUserIdRepositoryInput): Promise<TicketEntity | null>;
  updateStatus(data: UpdateTicketStatusRepositoryInput): Promise<TicketEntity>;
}
