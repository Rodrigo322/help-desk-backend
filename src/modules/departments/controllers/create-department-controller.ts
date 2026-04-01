import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeCreateDepartmentUseCase } from "../factories/make-create-department-use-case";

const createDepartmentBodySchema = z.object({
  name: z.string().min(1),
  managerUserId: z.string().uuid().optional().or(z.literal(""))
});

const createDepartmentParamsSchema = z.object({});
const createDepartmentQuerySchema = z.object({});

export class CreateDepartmentController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, managerUserId } = createDepartmentBodySchema.parse(request.body);
      createDepartmentParamsSchema.parse(request.params);
      createDepartmentQuerySchema.parse(request.query);

      const createDepartmentUseCase = makeCreateDepartmentUseCase();
      const result = await createDepartmentUseCase.execute({
        name,
        ...(managerUserId ? { managerUserId } : {})
      });

      return response.status(201).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
