import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeListTicketAuditLogsUseCase } from "../factories/make-list-ticket-audit-logs-use-case";

const listTicketAuditLogsBodySchema = z.object({});
const listTicketAuditLogsParamsSchema = z.object({
  ticketId: z.string().uuid()
});
const listTicketAuditLogsQuerySchema = z.object({});

export class ListTicketAuditLogsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listTicketAuditLogsBodySchema.parse(request.body ?? {});
      const { ticketId } = listTicketAuditLogsParamsSchema.parse(request.params);
      listTicketAuditLogsQuerySchema.parse(request.query);

      const listTicketAuditLogsUseCase = makeListTicketAuditLogsUseCase();
      const result = await listTicketAuditLogsUseCase.execute({ ticketId });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
