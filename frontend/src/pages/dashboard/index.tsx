import { Link } from "react-router-dom";

import { Card } from "../../components/ui/card";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Visão geral rápida do sistema de chamados.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-800">Tickets</h2>
          <p className="text-sm text-slate-600">Gerencie chamados, status, comentários e anexos.</p>
          <Link className="text-sm font-medium text-brand-700" to="/tickets">
            Ir para lista de tickets
          </Link>
        </Card>

        <Card className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-800">Novo chamado</h2>
          <p className="text-sm text-slate-600">Abra um chamado e defina a prioridade inicial.</p>
          <Link className="text-sm font-medium text-brand-700" to="/tickets/new">
            Criar ticket
          </Link>
        </Card>
      </div>
    </div>
  );
}

