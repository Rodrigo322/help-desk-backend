import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useDashboard } from "../../hooks/use-dashboard";

export function DashboardPage() {
  const navigate = useNavigate();
  const { metrics, isLoading, isError, errorMessage } = useDashboard();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Visao geral inicial do sistema de chamados.</p>
      </header>

      {isLoading ? <Loading /> : null}
      {isError ? <ErrorState message={errorMessage ?? "Erro ao carregar dashboard."} /> : null}

      {!isLoading && !isError ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{metrics.total}</p>
          </Card>

          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Abertos</p>
            <p className="text-2xl font-semibold text-sky-700">{metrics.open}</p>
          </Card>

          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Em andamento
            </p>
            <p className="text-2xl font-semibold text-amber-700">{metrics.inProgress}</p>
          </Card>

          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Fechados</p>
            <p className="text-2xl font-semibold text-emerald-700">{metrics.closed}</p>
          </Card>
        </section>
      ) : null}

      <Card className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Acoes rapidas</h2>
          <p className="text-sm text-slate-500">Navegue para os fluxos principais do sistema.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/tickets")}>Ver tickets</Button>
          <Button variant="secondary" onClick={() => navigate("/tickets/new")}>
            Criar ticket
          </Button>
        </div>
      </Card>
    </div>
  );
}
