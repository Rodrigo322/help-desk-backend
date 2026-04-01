import { PrismaTicketAuditLogsRepository } from "../repositories/prisma/prisma-ticket-audit-logs-repository";
import { PrismaTicketsRepository } from "../../tickets/repositories/prisma/prisma-tickets-repository";
import { ListTicketAuditLogsUseCase } from "../use-cases/list-ticket-audit-logs-use-case";

export function makeListTicketAuditLogsUseCase() {
  const ticketAuditLogsRepository = new PrismaTicketAuditLogsRepository();
  const ticketsRepository = new PrismaTicketsRepository();

  return new ListTicketAuditLogsUseCase(ticketAuditLogsRepository, ticketsRepository);
}
