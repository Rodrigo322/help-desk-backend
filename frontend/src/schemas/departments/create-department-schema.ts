import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Informe o nome do departamento."),
  managerUserId: z
    .string()
    .trim()
    .refine((value) => !value || z.string().uuid().safeParse(value).success, {
      message: "Informe um UUID valido para o gestor."
    })
    .optional()
    .transform((value) => (value ? value : undefined))
});

export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
