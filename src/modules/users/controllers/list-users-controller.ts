import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeListUsersUseCase } from "../factories/make-list-users-use-case";

const listUsersBodySchema = z.object({});
const listUsersParamsSchema = z.object({});
const listUsersQuerySchema = z.object({
  includeInactive: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true")
});

export class ListUsersController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listUsersBodySchema.parse(request.body ?? {});
      listUsersParamsSchema.parse(request.params);
      const { includeInactive } = listUsersQuerySchema.parse(request.query);

      const listUsersUseCase = makeListUsersUseCase();
      const result = await listUsersUseCase.execute({ includeInactive });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
