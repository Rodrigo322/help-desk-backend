import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeGetUserByIdUseCase } from "../factories/make-get-user-by-id-use-case";

const getUserByIdBodySchema = z.object({});
const getUserByIdParamsSchema = z.object({
  id: z.string().uuid()
});
const getUserByIdQuerySchema = z.object({});

export class GetUserByIdController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      getUserByIdBodySchema.parse(request.body ?? {});
      const { id } = getUserByIdParamsSchema.parse(request.params);
      getUserByIdQuerySchema.parse(request.query);

      const getUserByIdUseCase = makeGetUserByIdUseCase();
      const result = await getUserByIdUseCase.execute({ userId: id });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
