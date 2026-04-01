import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeResolveTicketUseCase } from "../factories/make-resolve-ticket-use-case";

const resolveTicketBodySchema = z.object({});
const resolveTicketParamsSchema = z.object({
  id: z.string().uuid()
});
const resolveTicketQuerySchema = z.object({});

export class ResolveTicketController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      resolveTicketBodySchema.parse(request.body ?? {});
      const { id } = resolveTicketParamsSchema.parse(request.params);
      resolveTicketQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const resolveTicketUseCase = makeResolveTicketUseCase();
      const result = await resolveTicketUseCase.execute({
        ticketId: id,
        userId
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
