import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeAssignTicketToSelfUseCase } from "../factories/make-assign-ticket-to-self-use-case";

const assignTicketToSelfBodySchema = z.object({});
const assignTicketToSelfParamsSchema = z.object({
  id: z.string().uuid()
});
const assignTicketToSelfQuerySchema = z.object({});

export class AssignTicketToSelfController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      assignTicketToSelfBodySchema.parse(request.body ?? {});
      const { id } = assignTicketToSelfParamsSchema.parse(request.params);
      assignTicketToSelfQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const assignTicketToSelfUseCase = makeAssignTicketToSelfUseCase();
      const result = await assignTicketToSelfUseCase.execute({
        ticketId: id,
        userId
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
