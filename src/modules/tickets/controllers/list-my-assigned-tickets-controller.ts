import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES } from "../entities/ticket";
import { makeListMyAssignedTicketsUseCase } from "../factories/make-list-my-assigned-tickets-use-case";

const listMyAssignedTicketsBodySchema = z.object({});
const listMyAssignedTicketsParamsSchema = z.object({});
const listMyAssignedTicketsQuerySchema = z.object({
  status: z.enum(TICKET_STATUS_VALUES).optional(),
  priority: z.enum(TICKET_PRIORITY_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export class ListMyAssignedTicketsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listMyAssignedTicketsBodySchema.parse(request.body ?? {});
      listMyAssignedTicketsParamsSchema.parse(request.params);
      const { status, priority, page, pageSize } = listMyAssignedTicketsQuerySchema.parse(
        request.query
      );

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const listMyAssignedTicketsUseCase = makeListMyAssignedTicketsUseCase();
      const result = await listMyAssignedTicketsUseCase.execute({
        userId,
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
