import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { AppError } from "../../../../src/shared/errors/app-error";
import { CreateUserUseCase } from "../../../../src/modules/users/use-cases/create-user-use-case";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";

describe("CreateUserUseCase", () => {
  it("should create a new user with hashed password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new CreateUserUseCase(usersRepository);

    const result = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    });

    expect(result.user.id).toBeTypeOf("string");
    expect(result.user.email).toBe("john@example.com");

    const storedUser = usersRepository.items[0];
    expect(storedUser.password).not.toBe("123456");

    const passwordMatches = await compare("123456", storedUser.password);
    expect(passwordMatches).toBe(true);
  });

  it("should not allow duplicated email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new CreateUserUseCase(usersRepository);

    await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    });

    await expect(
      sut.execute({
        name: "Jane Doe",
        email: "john@example.com",
        password: "abcdef"
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should fail when input is invalid", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new CreateUserUseCase(usersRepository);

    await expect(
      sut.execute({
        name: "",
        email: "john@example.com",
        password: "123456"
      })
    ).rejects.toMatchObject({ message: "Invalid input.", statusCode: 400 });
  });
});

