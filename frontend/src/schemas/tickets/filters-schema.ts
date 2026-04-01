import { z } from "zod";

export const ticketFiltersSchema = z.object({
  scope: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["department", "created", "assigned"]).default("department")
  ),
  status: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .enum(["NEW", "OPEN", "IN_PROGRESS", "PENDING", "ON_HOLD", "RESOLVED", "CLOSED"])
      .optional()
  ),
  priority: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["LOW", "MEDIUM", "HIGH"]).optional()
  ),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

export type TicketFiltersFormInput = z.input<typeof ticketFiltersSchema>;
export type TicketFiltersFormData = z.output<typeof ticketFiltersSchema>;
