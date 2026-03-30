import { describe, expect, it } from "vitest";

import { AppError } from "../../../../src/shared/errors/app-error";
import { AuthenticateUseCase } from "../../../../src/modules/auth/use-cases/authenticate-use-case";
import { CreateUserUseCase } from "../../../../src/modules/users/use-cases/create-user-use-case";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory-users-repository";

describe("AuthenticateUseCase", () => {
  it("should authenticate with valid credentials", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const signUpUseCase = new CreateUserUseCase(usersRepository);
    const sut = new AuthenticateUseCase(usersRepository);

    process.env.JWT_SECRET = "test-secret";

    await signUpUseCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    });

    const result = await sut.execute({
      email: "john@example.com",
      password: "123456"
    });

    expect(result.token).toBeTypeOf("string");
    expect(result.user.email).toBe("john@example.com");
  });

  it("should fail when credentials are invalid", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    process.env.JWT_SECRET = "test-secret";

    await expect(
      sut.execute({
        email: "missing@example.com",
        password: "123456"
      })
    ).rejects.toMatchObject({ message: "Invalid credentials.", statusCode: 401 });
  });

  it("should fail when password is incorrect", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const signUpUseCase = new CreateUserUseCase(usersRepository);
    const sut = new AuthenticateUseCase(usersRepository);

    process.env.JWT_SECRET = "test-secret";

    await signUpUseCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    });

    await expect(
      sut.execute({
        email: "john@example.com",
        password: "wrong-password"
      })
    ).rejects.toMatchObject({ message: "Invalid credentials.", statusCode: 401 });
  });

  it("should fail when JWT secret is missing", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const signUpUseCase = new CreateUserUseCase(usersRepository);
    const sut = new AuthenticateUseCase(usersRepository);

    delete process.env.JWT_SECRET;

    await signUpUseCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    });

    await expect(
      sut.execute({
        email: "john@example.com",
        password: "123456"
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

