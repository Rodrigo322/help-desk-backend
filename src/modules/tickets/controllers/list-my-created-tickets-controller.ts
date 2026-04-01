import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES } from "../entities/ticket";
import { makeListMyCreatedTicketsUseCase } from "../factories/make-list-my-created-tickets-use-case";

const listMyCreatedTicketsBodySchema = z.object({});
const listMyCreatedTicketsParamsSchema = z.object({});
const listMyCreatedTicketsQuerySchema = z.object({
  status: z.enum(TICKET_STATUS_VALUES).optional(),
  priority: z.enum(TICKET_PRIORITY_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export class ListMyCreatedTicketsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listMyCreatedTicketsBodySchema.parse(request.body ?? {});
      listMyCreatedTicketsParamsSchema.parse(request.params);
      const { status, priority, page, pageSize } = listMyCreatedTicketsQuerySchema.parse(
        request.query
      );

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const listMyCreatedTicketsUseCase = makeListMyCreatedTicketsUseCase();
      const result = await listMyCreatedTicketsUseCase.execute({
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
