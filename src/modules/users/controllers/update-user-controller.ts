import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { USER_ROLE_VALUES } from "../entities/user";
import { makeUpdateUserUseCase } from "../factories/make-update-user-use-case";

const updateUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
  departmentId: z.string().uuid(),
  role: z.enum(USER_ROLE_VALUES),
  password: z.string().min(6).optional()
});

const updateUserParamsSchema = z.object({
  id: z.string().uuid()
});

const updateUserQuerySchema = z.object({});

export class UpdateUserController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, email, departmentId, role, password } = updateUserBodySchema.parse(request.body);
      const { id } = updateUserParamsSchema.parse(request.params);
      updateUserQuerySchema.parse(request.query);

      const updateUserUseCase = makeUpdateUserUseCase();
      const result = await updateUserUseCase.execute({
        userId: id,
        name,
        email,
        departmentId,
        role,
        ...(password ? { password } : {})
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
