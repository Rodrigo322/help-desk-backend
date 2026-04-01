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
        <p className="text-sm text-slate-500">Visao geral do fluxo de chamados por departamento.</p>
      </header>

      {isLoading ? <Loading /> : null}
      {isError ? <ErrorState message={errorMessage ?? "Erro ao carregar dashboard."} /> : null}

      {!isLoading && !isError ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Do meu departamento
            </p>
            <p className="text-2xl font-semibold text-slate-900">{metrics.departmentTotal}</p>
          </Card>

          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Que eu criei</p>
            <p className="text-2xl font-semibold text-sky-700">{metrics.createdTotal}</p>
          </Card>

          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Atribuidos a mim
            </p>
            <p className="text-2xl font-semibold text-amber-700">{metrics.assignedTotal}</p>
          </Card>

          <Card className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Abertos no departamento
            </p>
            <p className="text-2xl font-semibold text-emerald-700">{metrics.openDepartmentTotal}</p>
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
          <Button variant="ghost" onClick={() => navigate("/notifications")}>
            Notificacoes
          </Button>
        </div>
      </Card>
    </div>
  );
}
