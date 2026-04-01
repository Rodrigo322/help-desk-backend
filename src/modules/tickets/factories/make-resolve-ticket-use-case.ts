import { PrismaTicketAuditLogsRepository } from "../../auditlogs/repositories/prisma/prisma-ticket-audit-logs-repository";
import { PrismaNotificationsRepository } from "../../notifications/repositories/prisma/prisma-notifications-repository";
import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { ResolveTicketUseCase } from "../use-cases/resolve-ticket-use-case";

export function makeResolveTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const notificationsRepository = new PrismaNotificationsRepository();
  const ticketAuditLogsRepository = new PrismaTicketAuditLogsRepository();

  return new ResolveTicketUseCase(
    ticketsRepository,
    usersRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );
}
