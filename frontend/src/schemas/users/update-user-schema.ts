import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Informe o nome."),
  email: z.string().min(1, "Informe o e-mail.").email("Informe um e-mail valido."),
  password: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 6, "A senha deve ter no minimo 6 caracteres."),
  departmentId: z.string().uuid("Selecione um departamento valido."),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"], {
    message: "Selecione o perfil."
  })
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean()
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusFormData = z.infer<typeof updateUserStatusSchema>;
