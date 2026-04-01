import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Informe o e-mail." })
    .min(1, "Informe o e-mail.")
    .email("Informe um e-mail valido."),
  password: z.string({ required_error: "Informe a senha." }).min(1, "Informe a senha.")
});

export type SignInFormData = z.infer<typeof signInSchema>;
