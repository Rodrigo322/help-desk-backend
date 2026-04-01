import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { TICKET_PRIORITY_VALUES } from "../entities/ticket";
import { makeCreateTicketUseCase } from "../factories/make-create-ticket-use-case";

const createTicketBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(TICKET_PRIORITY_VALUES),
  targetDepartmentId: z.string().min(1)
});

const createTicketParamsSchema = z.object({});
const createTicketQuerySchema = z.object({});

export class CreateTicketController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { title, description, priority, targetDepartmentId } = createTicketBodySchema.parse(
        request.body
      );
      createTicketParamsSchema.parse(request.params);
      createTicketQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const createTicketUseCase = makeCreateTicketUseCase();
      const result = await createTicketUseCase.execute({
        title,
        description,
        priority,
        targetDepartmentId,
        createdByUserId: userId
      });

      return response.status(201).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
