import { UserRole } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { AppError } from "../../../shared/errors/app-error";
import { UsersRepository } from "../../users/repositories/users-repository";

export type AuthenticateUseCaseRequest = {
  email: string;
  password: string;
};

export type AuthenticateUseCaseResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    departmentId: string;
    role: UserRole;
  };
};

export class AuthenticateUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const { email, password } = input;

    if (!email || !password) {
      throw new AppError("Invalid credentials.", 400);
    }

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials.", 401);
    }

    if (!user.isActive) {
      throw new AppError("User account is inactive.", 403);
    }

    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new AppError("Invalid credentials.", 401);
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError("JWT secret is not configured.", 500);
    }

    const token = sign(
      {
        departmentId: user.departmentId,
        role: user.role
      },
      jwtSecret,
      {
      subject: user.id,
      expiresIn: "1d"
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        departmentId: user.departmentId,
        role: user.role
      }
    };
  }
}
