import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signInSchema, SignInFormData } from "../../schemas/auth/sign-in-schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type SignInFormProps = {
  isLoading: boolean;
  onSubmit: (data: SignInFormData) => Promise<void> | void;
};

export function SignInForm({ isLoading, onSubmit }: SignInFormProps) {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />

      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

