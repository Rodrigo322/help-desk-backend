import { TicketStatus } from "../types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  NEW: "Novo",
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  PENDING: "Pendente",
  ON_HOLD: "Em espera",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado"
};

export function formatStatus(status: TicketStatus): string {
  return statusLabels[status];
}
