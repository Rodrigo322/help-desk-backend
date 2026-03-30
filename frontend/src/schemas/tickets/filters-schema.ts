import { z } from "zod";

export const ticketFiltersSchema = z.object({
  status: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional()
  ),
  priority: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["LOW", "MEDIUM", "HIGH"]).optional()
  ),
  userId: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().uuid().optional()
  ),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export type TicketFiltersFormInput = z.input<typeof ticketFiltersSchema>;
export type TicketFiltersFormData = z.output<typeof ticketFiltersSchema>;
