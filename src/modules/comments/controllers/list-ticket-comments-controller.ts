import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeListTicketCommentsUseCase } from "../factories/make-list-ticket-comments-use-case";

const listTicketCommentsBodySchema = z.object({});

const listTicketCommentsParamsSchema = z.object({
  ticketId: z.string().uuid()
});

const listTicketCommentsQuerySchema = z.object({
  includeInternal: z.coerce.boolean().optional()
});

export class ListTicketCommentsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listTicketCommentsBodySchema.parse(request.body ?? {});
      const { ticketId } = listTicketCommentsParamsSchema.parse(request.params);
      const { includeInternal } = listTicketCommentsQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const listTicketCommentsUseCase = makeListTicketCommentsUseCase();
      const result = await listTicketCommentsUseCase.execute({
        ticketId,
        userId,
        includeInternal
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
