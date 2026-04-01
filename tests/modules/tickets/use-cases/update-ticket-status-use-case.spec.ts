import { describe, expect, it } from "vitest";

import { AssignTicketToSelfUseCase } from "../../../../src/modules/tickets/use-cases/assign-ticket-to-self-use-case";
import { CloseTicketUseCase } from "../../../../src/modules/tickets/use-cases/close-ticket-use-case";
import { CreateTicketUseCase } from "../../../../src/modules/tickets/use-cases/create-ticket-use-case";
import { TicketAlreadyAssignedError } from "../../../../src/modules/tickets/errors/ticket-already-assigned-error";
import { UnauthorizedTicketCloseError } from "../../../../src/modules/tickets/errors/unauthorized-ticket-close-error";
import { InMemoryTicketAuditLogsRepository } from "../../../modules/auditlogs/repositories/in-memory-ticket-audit-logs-repository";
import { InMemoryDepartmentsRepository } from "../../../modules/departments/repositories/in-memory-departments-repository";
import { InMemoryNotificationsRepository } from "../../../modules/notifications/repositories/in-memory-notifications-repository";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory-users-repository";
import { InMemoryTicketsRepository } from "../repositories/in-memory-tickets-repository";

async function setupTicketFlowContext() {
  const usersRepository = new InMemoryUsersRepository();
  const ticketsRepository = new InMemoryTicketsRepository();
  const departmentsRepository = new InMemoryDepartmentsRepository();
  const notificationsRepository = new InMemoryNotificationsRepository();
  const ticketAuditLogsRepository = new InMemoryTicketAuditLogsRepository();

  const targetDepartment = await departmentsRepository.create({ name: "Support" });
  const requesterDepartment = await departmentsRepository.create({ name: "Finance" });

  const manager = await usersRepository.create({
    name: "Manager",
    email: "manager@example.com",
    password: "hashed-password",
    departmentId: targetDepartment.id,
    role: "MANAGER"
  });
  targetDepartment.managerUserId = manager.id;

  const requester = await usersRepository.create({
    name: "Requester",
    email: "requester@example.com",
    password: "hashed-password",
    departmentId: requesterDepartment.id,
    role: "EMPLOYEE"
  });

  const assignee = await usersRepository.create({
    name: "Analyst",
    email: "analyst@example.com",
    password: "hashed-password",
    departmentId: targetDepartment.id,
    role: "EMPLOYEE"
  });

  const outsider = await usersRepository.create({
    name: "Outsider",
    email: "outsider@example.com",
    password: "hashed-password",
    departmentId: requesterDepartment.id,
    role: "EMPLOYEE"
  });

  const createTicketUseCase = new CreateTicketUseCase(
    ticketsRepository,
    usersRepository,
    departmentsRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );

  const assignTicketToSelfUseCase = new AssignTicketToSelfUseCase(
    ticketsRepository,
    usersRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );

  const closeTicketUseCase = new CloseTicketUseCase(
    ticketsRepository,
    usersRepository,
    notificationsRepository,
    ticketAuditLogsRepository
  );

  const created = await createTicketUseCase.execute({
    title: "Cannot login",
    description: "Login fails with 401",
    priority: "MEDIUM",
    targetDepartmentId: targetDepartment.id,
    createdByUserId: requester.id
  });

  return {
    createdTicketId: created.ticket.id,
    users: { requester, assignee, outsider },
    useCases: { assignTicketToSelfUseCase, closeTicketUseCase }
  };
}

describe("Ticket Status Flow", () => {
  it("should set IN_PROGRESS when user from target department assigns ticket to self", async () => {
    const context = await setupTicketFlowContext();

    const result = await context.useCases.assignTicketToSelfUseCase.execute({
      ticketId: context.createdTicketId,
      userId: context.users.assignee.id
    });

    expect(result.ticket.status).toBe("IN_PROGRESS");
    expect(result.ticket.assignedToUserId).toBe(context.users.assignee.id);
  });

  it("should not allow assigning the same ticket twice", async () => {
    const context = await setupTicketFlowContext();

    await context.useCases.assignTicketToSelfUseCase.execute({
      ticketId: context.createdTicketId,
      userId: context.users.assignee.id
    });

    await expect(
      context.useCases.assignTicketToSelfUseCase.execute({
        ticketId: context.createdTicketId,
        userId: context.users.assignee.id
      })
    ).rejects.toBeInstanceOf(TicketAlreadyAssignedError);
  });

  it("should resolve first and close on second call", async () => {
    const context = await setupTicketFlowContext();

    await context.useCases.assignTicketToSelfUseCase.execute({
      ticketId: context.createdTicketId,
      userId: context.users.assignee.id
    });

    const firstClose = await context.useCases.closeTicketUseCase.execute({
      ticketId: context.createdTicketId,
      userId: context.users.assignee.id
    });

    expect(firstClose.ticket.status).toBe("RESOLVED");

    const secondClose = await context.useCases.closeTicketUseCase.execute({
      ticketId: context.createdTicketId,
      userId: context.users.assignee.id
    });

    expect(secondClose.ticket.status).toBe("CLOSED");
  });

  it("should fail close when user is not authorized", async () => {
    const context = await setupTicketFlowContext();

    await expect(
      context.useCases.closeTicketUseCase.execute({
        ticketId: context.createdTicketId,
        userId: context.users.outsider.id
      })
    ).rejects.toBeInstanceOf(UnauthorizedTicketCloseError);
  });
});
