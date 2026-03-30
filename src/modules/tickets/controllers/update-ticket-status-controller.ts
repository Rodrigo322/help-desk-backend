import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { TICKET_STATUS_VALUES } from "../entities/ticket";
import { makeUpdateTicketStatusUseCase } from "../factories/make-update-ticket-status-use-case";

const updateTicketStatusBodySchema = z
  .object({
    status: z.enum(TICKET_STATUS_VALUES)
  })
  .strict();
const updateTicketStatusParamsSchema = z.object({
  id: z.string().uuid()
});
const updateTicketStatusQuerySchema = z.object({});

export class UpdateTicketStatusController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { status } = updateTicketStatusBodySchema.parse(request.body);
      const { id } = updateTicketStatusParamsSchema.parse(request.params);
      updateTicketStatusQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const updateTicketStatusUseCase = makeUpdateTicketStatusUseCase();
      const result = await updateTicketStatusUseCase.execute({
        ticketId: id,
        userId,
        status
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
