import { TicketStatus } from "../types/ticket";

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["CLOSED"],
  CLOSED: []
};

export function getAllowedNextTicketStatuses(currentStatus: TicketStatus): TicketStatus[] {
  return allowedTransitions[currentStatus];
}

export function isTicketStatusTransitionAllowed(
  currentStatus: TicketStatus,
  nextStatus: TicketStatus
): boolean {
  return getAllowedNextTicketStatuses(currentStatus).includes(nextStatus);
}
