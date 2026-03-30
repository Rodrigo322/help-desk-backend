export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TicketsListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ListTicketsResponse = {
  items: Ticket[];
  meta: TicketsListMeta;
};

export type GetTicketDetailsResponse = {
  ticket: Ticket;
};

