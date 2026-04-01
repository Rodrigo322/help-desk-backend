import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeGetDepartmentByIdUseCase } from "../factories/make-get-department-by-id-use-case";

const getDepartmentByIdBodySchema = z.object({});
const getDepartmentByIdParamsSchema = z.object({
  id: z.string().uuid()
});
const getDepartmentByIdQuerySchema = z.object({});

export class GetDepartmentByIdController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      getDepartmentByIdBodySchema.parse(request.body ?? {});
      const { id } = getDepartmentByIdParamsSchema.parse(request.params);
      getDepartmentByIdQuerySchema.parse(request.query);

      const getDepartmentByIdUseCase = makeGetDepartmentByIdUseCase();
      const result = await getDepartmentByIdUseCase.execute({ departmentId: id });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
