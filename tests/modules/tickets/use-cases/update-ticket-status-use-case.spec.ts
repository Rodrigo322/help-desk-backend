import { describe, expect, it } from "vitest";

import { AppError } from "../../../../src/shared/errors/app-error";
import { InvalidTicketStatusTransitionError } from "../../../../src/modules/tickets/errors/invalid-ticket-status-transition-error";
import { CreateTicketUseCase } from "../../../../src/modules/tickets/use-cases/create-ticket-use-case";
import { UpdateTicketStatusUseCase } from "../../../../src/modules/tickets/use-cases/update-ticket-status-use-case";
import { InMemoryTicketsRepository } from "../repositories/in-memory-tickets-repository";

describe("UpdateTicketStatusUseCase", () => {
  it("should allow OPEN -> IN_PROGRESS transition", async () => {
    const ticketsRepository = new InMemoryTicketsRepository();
    const createTicketUseCase = new CreateTicketUseCase(ticketsRepository);
    const sut = new UpdateTicketStatusUseCase(ticketsRepository);

    const createdTicket = await createTicketUseCase.execute({
      title: "Cannot login",
      description: "Login fails with 401",
      priority: "MEDIUM",
      userId: "user-1"
    });

    const result = await sut.execute({
      ticketId: createdTicket.ticket.id,
      userId: "user-1",
      status: "IN_PROGRESS"
    });

    expect(result.ticket.status).toBe("IN_PROGRESS");
  });

  it("should fail when ticket is not found", async () => {
    const ticketsRepository = new InMemoryTicketsRepository();
    const sut = new UpdateTicketStatusUseCase(ticketsRepository);

    await expect(
      sut.execute({
        ticketId: "missing-id",
        userId: "user-1",
        status: "CLOSED"
      })
    ).rejects.toMatchObject({ message: "Ticket not found.", statusCode: 404 });
  });

  it("should fail on invalid transition OPEN -> OPEN", async () => {
    const ticketsRepository = new InMemoryTicketsRepository();
    const createTicketUseCase = new CreateTicketUseCase(ticketsRepository);
    const sut = new UpdateTicketStatusUseCase(ticketsRepository);

    const createdTicket = await createTicketUseCase.execute({
      title: "Cannot login",
      description: "Login fails with 401",
      priority: "MEDIUM",
      userId: "user-1"
    });

    await expect(
      sut.execute({
        ticketId: createdTicket.ticket.id,
        userId: "user-1",
        status: "OPEN"
      })
    ).rejects.toBeInstanceOf(InvalidTicketStatusTransitionError);
  });

  it("should fail on invalid transition CLOSED -> IN_PROGRESS", async () => {
    const ticketsRepository = new InMemoryTicketsRepository();
    const createTicketUseCase = new CreateTicketUseCase(ticketsRepository);
    const sut = new UpdateTicketStatusUseCase(ticketsRepository);

    const createdTicket = await createTicketUseCase.execute({
      title: "Cannot login",
      description: "Login fails with 401",
      priority: "MEDIUM",
      userId: "user-1"
    });

    await sut.execute({
      ticketId: createdTicket.ticket.id,
      userId: "user-1",
      status: "CLOSED"
    });

    await expect(
      sut.execute({
        ticketId: createdTicket.ticket.id,
        userId: "user-1",
        status: "IN_PROGRESS"
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

