import { PrismaTicketAuditLogsRepository } from "../../auditlogs/repositories/prisma/prisma-ticket-audit-logs-repository";
import { PrismaNotificationsRepository } from "../../notifications/repositories/prisma/prisma-notifications-repository";
import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { AssignTicketToSelfUseCase } from "../use-cases/assign-ticket-to-self-use-case";

export function makeAssignTicketToSelfUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const notificationsRepository = new PrismaNotificationsRepository();
  const ticketAuditLogsRepository = new PrismaTicketAuditLogsRepository();

  return new AssignTicketToSelfUseCase(
    ticketsRepository,
    usersRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );
}
