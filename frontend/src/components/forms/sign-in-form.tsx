import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { signInSchema, SignInFormData } from "../../schemas/auth/sign-in-schema";
import { Button } from "../ui/button";

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
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-[15px] font-semibold text-slate-800">E-mail</label>
        <div className="relative">
          <AtSign
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            placeholder="exemplo@justitratores.com.br"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email?.message ? (
          <p className="mt-1.5 text-sm text-red-500">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-[15px] font-semibold text-slate-800">Senha</label>
        <div className="relative">
          <Lock
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            placeholder="********"
            {...form.register("password")}
          />
        </div>
        {form.formState.errors.password?.message ? (
          <p className="mt-1.5 text-sm text-red-500">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded-full border-slate-300 text-brand-600" />
          Lembrar-me
        </label>
        <a href="#" className="font-medium text-slate-600 hover:text-brand-700">
          Esqueci minha senha
        </a>
      </div>

      <Button
        type="submit"
        className="w-full rounded-2xl bg-[#facc15] py-3 text-base font-bold uppercase tracking-[0.08em] text-[#0b3f77] hover:bg-[#eab308]"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
        Problemas tecnicos?{" "}
        <span className="font-semibold text-brand-700">
          <ShieldCheck size={15} className="mb-0.5 mr-1 inline-block" />
          Fale com o Suporte TI
        </span>
      </div>
    </form>
  );
}
