import { CircleHelp, LockKeyhole } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

import { SignInForm } from "../../components/forms/sign-in-form";
import { ErrorState } from "../../components/ui/error-state";
import { useAuth } from "../../hooks/use-auth";
import { useSignIn } from "../../hooks/use-sign-in";
import { SignInFormData } from "../../schemas/auth/sign-in-schema";
import { getApiErrorMessage } from "../../services/api";

export function SignInPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const signInMutation = useSignIn();

  const redirectTo = (location.state as { from?: string } | undefined)?.from ?? "/";
  const errorMessage = signInMutation.isError ? getApiErrorMessage(signInMutation.error) : null;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleSignIn(data: SignInFormData) {
    signInMutation.reset();
    signInMutation.mutate(data);
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] md:grid md:grid-cols-[41%_59%]">
      <aside className="relative hidden overflow-hidden bg-[#0b3f77] md:flex md:flex-col md:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(130deg,transparent_0%,transparent_42%,rgba(255,255,255,0.1)_42%,rgba(255,255,255,0.1)_100%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-lg flex-col justify-center px-10 py-16 text-white">
          <div className="mb-10 h-48 w-48 rounded-sm bg-white/95" />

          <h1 className="text-6xl font-bold leading-tight tracking-tight">
            Sistema Interno de
            <br />
            Chamados
          </h1>
          <p className="mt-6 text-4xl font-semibold text-white/70">Justi Tratores</p>
        </div>

        <p className="relative z-10 px-10 pb-8 text-lg text-white/45">
          © 2024 Justi Tratores. Todos os direitos reservados.
        </p>
      </aside>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 md:px-10">
        <div className="w-full max-w-[620px] rounded-3xl border border-slate-200 bg-white px-7 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:px-10 md:py-10">
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Entrar</h1>
            <p className="mt-3 text-2xl text-slate-600">Acesse sua conta para gerenciar chamados.</p>
          </div>

          <div className="mt-8">
            {errorMessage ? <ErrorState message={errorMessage} /> : null}
            <SignInForm isLoading={signInMutation.isPending} onSubmit={handleSignIn} />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-8 text-lg text-slate-400">
          <span className="inline-flex items-center gap-2">
            <LockKeyhole size={16} />
            Conexao Segura
          </span>
          <span className="inline-flex items-center gap-2">
            <CircleHelp size={16} />
            Central de Ajuda
          </span>
        </div>
      </div>
    </div>
  );
}
