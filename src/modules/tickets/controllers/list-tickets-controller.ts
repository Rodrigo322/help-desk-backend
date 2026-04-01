import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES } from "../entities/ticket";
import { makeListDepartmentTicketsUseCase } from "../factories/make-list-department-tickets-use-case";

const listTicketsBodySchema = z.object({});
const listTicketsParamsSchema = z.object({});
const listTicketsQuerySchema = z.object({
  status: z.enum(TICKET_STATUS_VALUES).optional(),
  priority: z.enum(TICKET_PRIORITY_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export class ListTicketsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listTicketsBodySchema.parse(request.body ?? {});
      listTicketsParamsSchema.parse(request.params);
      const { status, priority, page, pageSize } = listTicketsQuerySchema.parse(request.query);

      const authenticatedUserId = request.user?.sub;

      if (!authenticatedUserId) {
        throw new AppError("Unauthorized.", 401);
      }

      const listDepartmentTicketsUseCase = makeListDepartmentTicketsUseCase();
      const result = await listDepartmentTicketsUseCase.execute({
        userId: authenticatedUserId,
        status,
        priority,
        page,
        pageSize
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
