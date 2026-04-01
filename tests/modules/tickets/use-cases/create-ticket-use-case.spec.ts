import { describe, expect, it } from "vitest";

import { CreateTicketUseCase } from "../../../../src/modules/tickets/use-cases/create-ticket-use-case";
import { DepartmentManagerNotFoundError } from "../../../../src/modules/tickets/errors/department-manager-not-found-error";
import { InMemoryTicketAuditLogsRepository } from "../../../modules/auditlogs/repositories/in-memory-ticket-audit-logs-repository";
import { InMemoryDepartmentsRepository } from "../../../modules/departments/repositories/in-memory-departments-repository";
import { InMemoryNotificationsRepository } from "../../../modules/notifications/repositories/in-memory-notifications-repository";
import { InMemoryTicketsRepository } from "../repositories/in-memory-tickets-repository";
import { InMemoryUsersRepository } from "../../users/repositories/in-memory-users-repository";

describe("CreateTicketUseCase", () => {
  it("should create a ticket with NEW as initial status and generate side effects", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const departmentsRepository = new InMemoryDepartmentsRepository();
    const notificationsRepository = new InMemoryNotificationsRepository();
    const ticketAuditLogsRepository = new InMemoryTicketAuditLogsRepository();

    const managerDepartment = await departmentsRepository.create({ name: "Support" });
    const manager = await usersRepository.create({
      name: "Manager",
      email: "manager@example.com",
      password: "hashed-password",
      departmentId: managerDepartment.id,
      role: "MANAGER"
    });
    managerDepartment.managerUserId = manager.id;

    const authorDepartment = await departmentsRepository.create({ name: "Finance" });
    const author = await usersRepository.create({
      name: "Author",
      email: "author@example.com",
      password: "hashed-password",
      departmentId: authorDepartment.id,
      role: "EMPLOYEE"
    });

    const sut = new CreateTicketUseCase(
      ticketsRepository,
      usersRepository,
      departmentsRepository,
      notificationsRepository,
      ticketAuditLogsRepository
    );

    const result = await sut.execute({
      title: "API is down",
      description: "The service returns 500 on GET /health",
      priority: "HIGH",
      targetDepartmentId: managerDepartment.id,
      createdByUserId: author.id
    });

    expect(result.ticket.id).toBeTypeOf("string");
    expect(result.ticket.status).toBe("NEW");
    expect(result.ticket.priority).toBe("HIGH");
    expect(result.ticket.createdByUserId).toBe(author.id);
    expect(result.ticket.originDepartmentId).toBe(author.departmentId);
    expect(result.ticket.targetDepartmentId).toBe(managerDepartment.id);
    expect(result.ticket.firstResponseDeadlineAt).toBeInstanceOf(Date);
    expect(result.ticket.resolutionDeadlineAt).toBeInstanceOf(Date);

    expect(notificationsRepository.items).toHaveLength(2);
    expect(ticketAuditLogsRepository.items).toHaveLength(1);
  });

  it("should fail when target department has no manager", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const departmentsRepository = new InMemoryDepartmentsRepository();
    const notificationsRepository = new InMemoryNotificationsRepository();
    const ticketAuditLogsRepository = new InMemoryTicketAuditLogsRepository();

    const department = await departmentsRepository.create({ name: "Support" });
    const author = await usersRepository.create({
      name: "Author",
      email: "author@example.com",
      password: "hashed-password",
      departmentId: department.id,
      role: "EMPLOYEE"
    });

    const sut = new CreateTicketUseCase(
      ticketsRepository,
      usersRepository,
      departmentsRepository,
      notificationsRepository,
      ticketAuditLogsRepository
    );

    await expect(
      sut.execute({
        title: "API is down",
        description: "The service returns 500 on GET /health",
        priority: "HIGH",
        targetDepartmentId: department.id,
        createdByUserId: author.id
      })
    ).rejects.toBeInstanceOf(DepartmentManagerNotFoundError);
  });
});
