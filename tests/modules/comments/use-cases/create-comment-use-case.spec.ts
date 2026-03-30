import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { AppError } from "../../../../src/shared/errors/app-error";
import { CreateCommentUseCase } from "../../../../src/modules/comments/use-cases/create-comment-use-case";
import { InMemoryCommentsRepository } from "../repositories/in-memory-comments-repository";
import { InMemoryTicketsRepository } from "../../tickets/repositories/in-memory-tickets-repository";
import { InMemoryUsersRepository } from "../../users/repositories/in-memory-users-repository";

describe("CreateCommentUseCase", () => {
  it("should create a comment linked to ticket and author", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const commentsRepository = new InMemoryCommentsRepository(usersRepository);
    const sut = new CreateCommentUseCase(commentsRepository, ticketsRepository);

    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password"
    });

    const ticket = await ticketsRepository.create({
      title: "Error 500",
      description: "Service unavailable",
      priority: "HIGH",
      status: "OPEN",
      userId: user.id
    });

    const result = await sut.execute({
      content: "I can reproduce this issue.",
      ticketId: ticket.id,
      userId: user.id
    });

    expect(result.comment.id).toBeTypeOf("string");
    expect(result.comment.ticketId).toBe(ticket.id);
    expect(result.comment.userId).toBe(user.id);
    expect(result.comment.author.email).toBe("john@example.com");
  });

  it("should fail when ticket does not exist", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const commentsRepository = new InMemoryCommentsRepository(usersRepository);
    const sut = new CreateCommentUseCase(commentsRepository, ticketsRepository);

    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password"
    });

    await expect(
      sut.execute({
        content: "I can reproduce this issue.",
        ticketId: randomUUID(),
        userId: user.id
      })
    ).rejects.toMatchObject({ message: "Ticket not found.", statusCode: 404 });
  });
});

