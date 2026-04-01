import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeListDepartmentsUseCase } from "../factories/make-list-departments-use-case";

const listDepartmentsBodySchema = z.object({});
const listDepartmentsParamsSchema = z.object({});
const listDepartmentsQuerySchema = z.object({
  includeInactive: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true")
});

export class ListDepartmentsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listDepartmentsBodySchema.parse(request.body ?? {});
      listDepartmentsParamsSchema.parse(request.params);
      const { includeInactive } = listDepartmentsQuerySchema.parse(request.query);

      if (includeInactive && request.user?.role !== "ADMIN") {
        throw new AppError("Only admins can include inactive departments.", 403);
      }

      const listDepartmentsUseCase = makeListDepartmentsUseCase();
      const result = await listDepartmentsUseCase.execute({ includeInactive });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
