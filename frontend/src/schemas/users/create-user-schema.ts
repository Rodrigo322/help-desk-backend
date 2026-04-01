import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Informe o nome."),
  email: z.string().min(1, "Informe o e-mail.").email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres."),
  departmentId: z.string().uuid("Selecione um departamento valido."),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"], {
    message: "Selecione o perfil."
  })
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
