export const TICKET_STATUS_VALUES = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;
export type TicketStatus = (typeof TICKET_STATUS_VALUES)[number];

export const TICKET_PRIORITY_VALUES = ["LOW", "MEDIUM", "HIGH"] as const;
export type TicketPriority = (typeof TICKET_PRIORITY_VALUES)[number];

