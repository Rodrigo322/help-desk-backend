import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeUpdateDepartmentUseCase } from "../factories/make-update-department-use-case";

const updateDepartmentBodySchema = z.object({
  name: z.string().min(1),
  managerUserId: z.string().uuid().optional().or(z.literal(""))
});
const updateDepartmentParamsSchema = z.object({
  id: z.string().uuid()
});
const updateDepartmentQuerySchema = z.object({});

export class UpdateDepartmentController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, managerUserId } = updateDepartmentBodySchema.parse(request.body);
      const { id } = updateDepartmentParamsSchema.parse(request.params);
      updateDepartmentQuerySchema.parse(request.query);

      const updateDepartmentUseCase = makeUpdateDepartmentUseCase();
      const result = await updateDepartmentUseCase.execute({
        departmentId: id,
        name,
        ...(managerUserId ? { managerUserId } : {})
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
