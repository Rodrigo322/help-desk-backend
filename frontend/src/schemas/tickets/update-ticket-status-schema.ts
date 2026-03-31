import { z } from "zod";

import { TicketStatus } from "../../types/ticket";
import { isTicketStatusTransitionAllowed } from "../../utils/ticket-status-transition";

const ticketStatusValues = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;

export const updateTicketStatusSchema = z.object({
  status: z.enum(ticketStatusValues, {
    message: "Selecione um status valido."
  })
});

export type UpdateTicketStatusFormData = z.infer<typeof updateTicketStatusSchema>;

export function buildUpdateTicketStatusSchema(currentStatus: TicketStatus) {
  return updateTicketStatusSchema.refine(
    (payload) => isTicketStatusTransitionAllowed(currentStatus, payload.status),
    {
      path: ["status"],
      message: "Transicao de status invalida."
    }
  );
}
