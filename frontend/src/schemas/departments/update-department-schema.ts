import { z } from "zod";

export const updateDepartmentSchema = z.object({
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

export const updateDepartmentStatusSchema = z.object({
  isActive: z.boolean()
});

export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
export type UpdateDepartmentStatusFormData = z.infer<typeof updateDepartmentStatusSchema>;
