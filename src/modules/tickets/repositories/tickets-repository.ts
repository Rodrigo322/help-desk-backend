import { TicketPriority, TicketStatus } from "../entities/ticket";

export type TicketEntity = {
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

export type CreateTicketRepositoryInput = {
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdByUserId: string;
  originDepartmentId: string;
  targetDepartmentId: string;
  firstResponseDeadlineAt: Date;
  resolutionDeadlineAt: Date;
};

export type UpdateTicketAssignmentRepositoryInput = {
  ticketId: string;
  assignedToUserId: string;
  status?: TicketStatus;
  firstResponseAt?: Date;
};

export type CloseTicketRepositoryInput = {
  ticketId: string;
  closedByUserId: string;
};

export type ResolveTicketRepositoryInput = {
  ticketId: string;
  resolvedByUserId: string;
};

export type UpdateTicketPriorityRepositoryInput = {
  ticketId: string;
  priority: TicketPriority;
};

export type TicketFilters = {
  status?: TicketStatus;
  priority?: TicketPriority;
};

export type ListTicketsRepositoryInput = {
  filters?: TicketFilters;
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
  findById(ticketId: string): Promise<TicketEntity | null>;
  assignToUser(data: UpdateTicketAssignmentRepositoryInput): Promise<TicketEntity>;
  resolve(data: ResolveTicketRepositoryInput): Promise<TicketEntity>;
  close(data: CloseTicketRepositoryInput): Promise<TicketEntity>;
  updatePriority(data: UpdateTicketPriorityRepositoryInput): Promise<TicketEntity>;
  listByTargetDepartment(
    departmentId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput>;
  listByCreatedByUser(
    userId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput>;
  listByAssignedToUser(
    userId: string,
    data: ListTicketsRepositoryInput
  ): Promise<ListTicketsRepositoryOutput>;
}
