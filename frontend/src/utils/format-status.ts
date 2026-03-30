import { TicketStatus } from "../types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  CLOSED: "Fechado"
};

export function formatStatus(status: TicketStatus): string {
  return statusLabels[status];
}

