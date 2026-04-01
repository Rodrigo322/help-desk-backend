import { Link } from "react-router-dom";

import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useAuth } from "../../hooks/use-auth";
import { useMyNotifications } from "../../hooks/use-notifications";
import { getApiErrorMessage } from "../../services/api";
import { formatDate } from "../../utils/format-date";

export function NotificationsPage() {
  const { user } = useAuth();
  const isManagerArea = user?.role === "MANAGER" || user?.role === "ADMIN";
  const notificationsQuery = useMyNotifications(isManagerArea);

  if (!isManagerArea) {
    return (
      <EmptyState
        title="Area de notificacoes restrita"
        description="Somente gestores e administradores visualizam notificacoes do departamento."
      />
    );
  }

  if (notificationsQuery.isLoading) {
    return <Loading />;
  }

  if (notificationsQuery.isError) {
    return <ErrorState message={getApiErrorMessage(notificationsQuery.error)} />;
  }

  const notifications = notificationsQuery.data?.notifications ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Notificacoes</h1>
        <p className="text-sm text-slate-500">
          Novos chamados enviados para o departamento sob sua gestao.
        </p>
      </header>

      {!notifications.length ? (
        <EmptyState title="Nenhuma notificacao" description="Sem novos chamados no momento." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="space-y-2">
              <p className="text-sm text-slate-800">{notification.message}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{formatDate(notification.createdAt)}</span>
                {notification.ticketId ? (
                  <Link className="font-medium text-brand-700 underline" to={`/tickets/${notification.ticketId}`}>
                    Abrir chamado
                  </Link>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
