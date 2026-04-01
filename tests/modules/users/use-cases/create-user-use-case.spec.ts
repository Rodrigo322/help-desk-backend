import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { CreateUserUseCase } from "../../../../src/modules/users/use-cases/create-user-use-case";
import { AppError } from "../../../../src/shared/errors/app-error";
import { InMemoryDepartmentsRepository } from "../../../modules/departments/repositories/in-memory-departments-repository";
import { InMemoryUsersRepository } from "../repositories/in-memory-users-repository";

describe("CreateUserUseCase", () => {
  it("should create a new user with hashed password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const departmentsRepository = new InMemoryDepartmentsRepository();
    const department = await departmentsRepository.create({ name: "Support" });
    const sut = new CreateUserUseCase(usersRepository, departmentsRepository);

    const result = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      departmentId: department.id,
      role: "EMPLOYEE"
    });

    expect(result.user.id).toBeTypeOf("string");
    expect(result.user.email).toBe("john@example.com");
    expect(result.user.departmentId).toBe(department.id);
    expect(result.user.role).toBe("EMPLOYEE");

    const storedUser = usersRepository.items[0];
    expect(storedUser.password).not.toBe("123456");
    expect(await compare("123456", storedUser.password)).toBe(true);
  });

  it("should not allow duplicated email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const departmentsRepository = new InMemoryDepartmentsRepository();
    const department = await departmentsRepository.create({ name: "Support" });
    const sut = new CreateUserUseCase(usersRepository, departmentsRepository);

    await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      departmentId: department.id,
      role: "EMPLOYEE"
    });

    await expect(
      sut.execute({
        name: "Jane Doe",
        email: "john@example.com",
        password: "abcdef",
        departmentId: department.id,
        role: "EMPLOYEE"
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should fail when input is invalid", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const departmentsRepository = new InMemoryDepartmentsRepository();
    const department = await departmentsRepository.create({ name: "Support" });
    const sut = new CreateUserUseCase(usersRepository, departmentsRepository);

    await expect(
      sut.execute({
        name: "",
        email: "john@example.com",
        password: "123456",
        departmentId: department.id,
        role: "EMPLOYEE"
      })
    ).rejects.toMatchObject({ message: "Invalid input.", statusCode: 400 });
  });
});
