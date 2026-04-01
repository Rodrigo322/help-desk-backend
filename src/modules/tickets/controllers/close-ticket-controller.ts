import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeCloseTicketUseCase } from "../factories/make-close-ticket-use-case";

const closeTicketBodySchema = z.object({});
const closeTicketParamsSchema = z.object({
  id: z.string().uuid()
});
const closeTicketQuerySchema = z.object({});

export class CloseTicketController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      closeTicketBodySchema.parse(request.body ?? {});
      const { id } = closeTicketParamsSchema.parse(request.params);
      closeTicketQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const closeTicketUseCase = makeCloseTicketUseCase();
      const result = await closeTicketUseCase.execute({
        ticketId: id,
        userId
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
