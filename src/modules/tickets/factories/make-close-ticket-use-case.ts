import { PrismaTicketAuditLogsRepository } from "../../auditlogs/repositories/prisma/prisma-ticket-audit-logs-repository";
import { PrismaNotificationsRepository } from "../../notifications/repositories/prisma/prisma-notifications-repository";
import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { CloseTicketUseCase } from "../use-cases/close-ticket-use-case";

export function makeCloseTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const notificationsRepository = new PrismaNotificationsRepository();
  const ticketAuditLogsRepository = new PrismaTicketAuditLogsRepository();

  return new CloseTicketUseCase(
    ticketsRepository,
    usersRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );
}
