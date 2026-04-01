import { TicketPriority } from "../entities/ticket";

type SlaConfig = {
  firstResponseHours: number;
  resolutionHours: number;
};

const SLA_BY_PRIORITY: Record<TicketPriority, SlaConfig> = {
  LOW: {
    firstResponseHours: 8,
    resolutionHours: 72
  },
  MEDIUM: {
    firstResponseHours: 4,
    resolutionHours: 48
  },
  HIGH: {
    firstResponseHours: 1,
    resolutionHours: 24
  }
};

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function buildTicketSlaDeadlines(priority: TicketPriority, baseDate = new Date()) {
  const config = SLA_BY_PRIORITY[priority];

  return {
    firstResponseDeadlineAt: addHours(baseDate, config.firstResponseHours),
    resolutionDeadlineAt: addHours(baseDate, config.resolutionHours)
  };
}
