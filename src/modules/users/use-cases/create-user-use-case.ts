import { AppError } from "../../../shared/errors/app-error";
import { hash } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";

export type CreateUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserUseCaseResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      throw new AppError("Invalid input.", 400);
    }

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError("Email already in use.", 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }
}
