import { RouterProvider } from "react-router-dom";

import { Card } from "./components/ui/card";
import { ErrorState } from "./components/ui/error-state";
import { router } from "./routes";
import { getFrontendEnvironmentErrors } from "./utils/env";

export function App() {
  const environmentErrors = getFrontendEnvironmentErrors();

  if (environmentErrors.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-2xl space-y-3">
          <h1 className="text-lg font-semibold text-slate-900">Configuracao de ambiente invalida</h1>
          <ErrorState
            message={`Nao foi possivel iniciar o frontend. ${environmentErrors.join(" ")}`}
          />
        </Card>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
