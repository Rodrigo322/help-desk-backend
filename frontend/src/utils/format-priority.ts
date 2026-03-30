import { TicketPriority } from "../types/ticket";

const priorityLabels: Record<TicketPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta"
};

export function formatPriority(priority: TicketPriority): string {
  return priorityLabels[priority];
}

