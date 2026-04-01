import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { CreateCommentUseCase } from "../../../../src/modules/comments/use-cases/create-comment-use-case";
import { AppError } from "../../../../src/shared/errors/app-error";
import { InMemoryCommentsRepository } from "../repositories/in-memory-comments-repository";
import { InMemoryTicketsRepository } from "../../tickets/repositories/in-memory-tickets-repository";
import { InMemoryUsersRepository } from "../../users/repositories/in-memory-users-repository";

describe("CreateCommentUseCase", () => {
  it("should create a comment linked to ticket and author", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const commentsRepository = new InMemoryCommentsRepository(usersRepository);
    const sut = new CreateCommentUseCase(commentsRepository, ticketsRepository, usersRepository);

    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password",
      departmentId: randomUUID(),
      role: "MANAGER"
    });

    const ticket = await ticketsRepository.create({
      title: "Error 500",
      description: "Service unavailable",
      priority: "HIGH",
      status: "NEW",
      createdByUserId: user.id,
      originDepartmentId: user.departmentId,
      targetDepartmentId: user.departmentId,
      firstResponseDeadlineAt: new Date(),
      resolutionDeadlineAt: new Date()
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
    expect(result.comment.isInternal).toBe(false);
  });

  it("should fail when employee tries to create internal comment", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const commentsRepository = new InMemoryCommentsRepository(usersRepository);
    const sut = new CreateCommentUseCase(commentsRepository, ticketsRepository, usersRepository);

    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password",
      departmentId: randomUUID(),
      role: "EMPLOYEE"
    });

    const ticket = await ticketsRepository.create({
      title: "Error 500",
      description: "Service unavailable",
      priority: "HIGH",
      status: "NEW",
      createdByUserId: user.id,
      originDepartmentId: user.departmentId,
      targetDepartmentId: user.departmentId,
      firstResponseDeadlineAt: new Date(),
      resolutionDeadlineAt: new Date()
    });

    await expect(
      sut.execute({
        content: "internal note",
        ticketId: ticket.id,
        userId: user.id,
        isInternal: true
      })
    ).rejects.toMatchObject({ message: "Only managers/admins can create internal comments.", statusCode: 403 });
  });

  it("should fail when ticket does not exist", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const ticketsRepository = new InMemoryTicketsRepository();
    const commentsRepository = new InMemoryCommentsRepository(usersRepository);
    const sut = new CreateCommentUseCase(commentsRepository, ticketsRepository, usersRepository);

    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password",
      departmentId: randomUUID(),
      role: "MANAGER"
    });

    await expect(
      sut.execute({
        content: "I can reproduce this issue.",
        ticketId: randomUUID(),
        userId: user.id
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
