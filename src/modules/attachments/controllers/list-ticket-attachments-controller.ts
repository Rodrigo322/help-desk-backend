import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeListTicketAttachmentsUseCase } from "../factories/make-list-ticket-attachments-use-case";

const listTicketAttachmentsBodySchema = z.object({});

const listTicketAttachmentsParamsSchema = z.object({
  ticketId: z.string().uuid()
});

const listTicketAttachmentsQuerySchema = z.object({});

export class ListTicketAttachmentsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listTicketAttachmentsBodySchema.parse(request.body ?? {});
      const { ticketId } = listTicketAttachmentsParamsSchema.parse(request.params);
      listTicketAttachmentsQuerySchema.parse(request.query);

      const listTicketAttachmentsUseCase = makeListTicketAttachmentsUseCase();
      const result = await listTicketAttachmentsUseCase.execute({ ticketId });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}

