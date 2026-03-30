import { describe, expect, it } from "vitest";

import { CreateTicketUseCase } from "../../../../src/modules/tickets/use-cases/create-ticket-use-case";
import { InMemoryTicketsRepository } from "../repositories/in-memory-tickets-repository";

describe("CreateTicketUseCase", () => {
  it("should create a ticket with OPEN as initial status", async () => {
    const ticketsRepository = new InMemoryTicketsRepository();
    const sut = new CreateTicketUseCase(ticketsRepository);

    const result = await sut.execute({
      title: "API is down",
      description: "The service returns 500 on GET /health",
      priority: "HIGH",
      userId: "user-1"
    });

    expect(result.ticket.id).toBeTypeOf("string");
    expect(result.ticket.status).toBe("OPEN");
    expect(result.ticket.priority).toBe("HIGH");
    expect(result.ticket.userId).toBe("user-1");
  });

  it("should propagate repository failures", async () => {
    const sut = new CreateTicketUseCase({
      create: async () => {
        throw new Error("Repository failure");
      },
      list: async () => ({ items: [], total: 0 }),
      findById: async () => null,
      findByIdAndUserId: async () => null,
      updateStatus: async () => {
        throw new Error("Not implemented");
      }
    });

    await expect(
      sut.execute({
        title: "API is down",
        description: "The service returns 500 on GET /health",
        priority: "HIGH",
        userId: "user-1"
      })
    ).rejects.toThrow("Repository failure");
  });
});

