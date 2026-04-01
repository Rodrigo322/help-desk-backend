import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeUpdateUserStatusUseCase } from "../factories/make-update-user-status-use-case";

const updateUserStatusBodySchema = z.object({
  isActive: z.boolean()
});

const updateUserStatusParamsSchema = z.object({
  id: z.string().uuid()
});

const updateUserStatusQuerySchema = z.object({});

export class UpdateUserStatusController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { isActive } = updateUserStatusBodySchema.parse(request.body);
      const { id } = updateUserStatusParamsSchema.parse(request.params);
      updateUserStatusQuerySchema.parse(request.query);

      if (!request.user?.sub || !request.user?.role) {
        throw new AppError("Unauthorized.", 401);
      }

      const updateUserStatusUseCase = makeUpdateUserStatusUseCase();
      const result = await updateUserStatusUseCase.execute({
        userId: id,
        isActive,
        actor: {
          userId: request.user.sub,
          role: request.user.role
        }
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
