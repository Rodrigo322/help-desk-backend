import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Informe o título."),
  description: z.string().min(1, "Informe a descrição."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    message: "Selecione a prioridade."
  })
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;

