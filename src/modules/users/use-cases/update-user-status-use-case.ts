import { AppError } from "../../../shared/errors/app-error";
import { UserRole } from "@prisma/client";

import { UsersRepository } from "../repositories/users-repository";

export type UpdateUserStatusUseCaseRequest = {
  userId: string;
  isActive: boolean;
  actor: {
    userId: string;
    role: UserRole;
  };
};

export type UpdateUserStatusUseCaseResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    departmentId: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export class UpdateUserStatusUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: UpdateUserStatusUseCaseRequest): Promise<UpdateUserStatusUseCaseResponse> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const isTryingToDisableSelf = input.actor.userId === input.userId && input.isActive === false;

    if (isTryingToDisableSelf) {
      throw new AppError("You cannot inactivate your own account.", 409);
    }

    const updatedUser = await this.usersRepository.setActive(input.userId, input.isActive);

    return {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        departmentId: updatedUser.departmentId,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    };
  }
}
