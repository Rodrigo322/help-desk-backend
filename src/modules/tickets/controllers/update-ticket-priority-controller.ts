import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { TICKET_PRIORITY_VALUES } from "../entities/ticket";
import { makeUpdateTicketPriorityUseCase } from "../factories/make-update-ticket-priority-use-case";

const updateTicketPriorityBodySchema = z
  .object({
    priority: z.enum(TICKET_PRIORITY_VALUES)
  })
  .strict();

const updateTicketPriorityParamsSchema = z.object({
  id: z.string().uuid()
});

const updateTicketPriorityQuerySchema = z.object({});

export class UpdateTicketPriorityController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { priority } = updateTicketPriorityBodySchema.parse(request.body);
      const { id } = updateTicketPriorityParamsSchema.parse(request.params);
      updateTicketPriorityQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const updateTicketPriorityUseCase = makeUpdateTicketPriorityUseCase();
      const result = await updateTicketPriorityUseCase.execute({
        ticketId: id,
        userId,
        priority
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
