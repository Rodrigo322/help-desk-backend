import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { SignInForm } from "../../components/forms/sign-in-form";
import { Card } from "../../components/ui/card";
import { ErrorState } from "../../components/ui/error-state";
import { useAuth } from "../../hooks/use-auth";
import { useSignIn } from "../../hooks/use-sign-in";
import { SignInFormData } from "../../schemas/auth/sign-in-schema";
import { getApiErrorMessage } from "../../services/api";

export function SignInPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const signInMutation = useSignIn();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: string } | undefined)?.from ?? "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSignIn(data: SignInFormData) {
    setErrorMessage(null);

    try {
      await signInMutation.mutateAsync(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Acessar sistema</h1>
          <p className="text-sm text-slate-500">Entre com suas credenciais para continuar.</p>
        </div>

        {errorMessage ? <ErrorState message={errorMessage} /> : null}

        <SignInForm isLoading={signInMutation.isPending} onSubmit={handleSignIn} />
      </Card>
    </div>
  );
}

