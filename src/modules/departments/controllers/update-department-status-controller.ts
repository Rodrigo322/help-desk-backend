import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeUpdateDepartmentStatusUseCase } from "../factories/make-update-department-status-use-case";

const updateDepartmentStatusBodySchema = z.object({
  isActive: z.boolean()
});
const updateDepartmentStatusParamsSchema = z.object({
  id: z.string().uuid()
});
const updateDepartmentStatusQuerySchema = z.object({});

export class UpdateDepartmentStatusController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { isActive } = updateDepartmentStatusBodySchema.parse(request.body);
      const { id } = updateDepartmentStatusParamsSchema.parse(request.params);
      updateDepartmentStatusQuerySchema.parse(request.query);

      const updateDepartmentStatusUseCase = makeUpdateDepartmentStatusUseCase();
      const result = await updateDepartmentStatusUseCase.execute({
        departmentId: id,
        isActive
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
