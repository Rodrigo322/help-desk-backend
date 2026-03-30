import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeGetTicketByIdUseCase } from "../factories/make-get-ticket-by-id-use-case";

const getTicketByIdBodySchema = z.object({});
const getTicketByIdParamsSchema = z.object({
  id: z.string().uuid()
});
const getTicketByIdQuerySchema = z.object({});

export class GetTicketByIdController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      getTicketByIdBodySchema.parse(request.body ?? {});
      const { id } = getTicketByIdParamsSchema.parse(request.params);
      getTicketByIdQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const getTicketByIdUseCase = makeGetTicketByIdUseCase();
      const result = await getTicketByIdUseCase.execute({
        ticketId: id,
        userId
      });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
