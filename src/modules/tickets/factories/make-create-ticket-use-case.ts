import { PrismaTicketAuditLogsRepository } from "../../auditlogs/repositories/prisma/prisma-ticket-audit-logs-repository";
import { PrismaDepartmentsRepository } from "../../departments/repositories/prisma/prisma-departments-repository";
import { PrismaNotificationsRepository } from "../../notifications/repositories/prisma/prisma-notifications-repository";
import { PrismaUsersRepository } from "../../users/repositories/prisma/prisma-users-repository";
import { PrismaTicketsRepository } from "../repositories/prisma/prisma-tickets-repository";
import { CreateTicketUseCase } from "../use-cases/create-ticket-use-case";

export function makeCreateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const usersRepository = new PrismaUsersRepository();
  const departmentsRepository = new PrismaDepartmentsRepository();
  const notificationsRepository = new PrismaNotificationsRepository();
  const ticketAuditLogsRepository = new PrismaTicketAuditLogsRepository();
  const useCase = new CreateTicketUseCase(
    ticketsRepository,
    usersRepository,
    departmentsRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );

  return useCase;
}
