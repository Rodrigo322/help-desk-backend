import {
  Building2,
  ChevronLeft,
  ClipboardList,
  Clock3,
  History,
  Paperclip,
  Printer,
  SendHorizontal,
  User,
  UserCheck
} from "lucide-react";
import { useParams } from "react-router-dom";

import { CreateCommentForm } from "../../components/forms/create-comment-form";
import { UploadAttachmentForm } from "../../components/forms/upload-attachment-form";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { PriorityBadge } from "../../components/ui/priority-badge";
import { StatusBadge } from "../../components/ui/status-badge";
import { useAuth } from "../../hooks/use-auth";
import { useDepartments } from "../../hooks/use-departments";
import {
  useTicketAttachments,
  useUploadTicketAttachment
} from "../../hooks/use-ticket-attachments";
import { useCreateTicketComment, useTicketComments } from "../../hooks/use-ticket-comments";
import {
  useAssignTicketToSelf,
  useCloseTicket,
  useTicketDetails
} from "../../hooks/use-ticket-details";
import { CommentFormData } from "../../schemas/tickets/comment-schema";
import { apiPublicBaseUrl, getApiErrorMessage } from "../../services/api";
import { formatDate } from "../../utils/format-date";
import { formatPriority } from "../../utils/format-priority";
import { formatStatus } from "../../utils/format-status";

function buildAttachmentUrl(fileUrl: string): string {
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  return `${apiPublicBaseUrl}${fileUrl}`;
}

function getSlaProgress(status: string): number {
  if (status === "CLOSED") {
    return 100;
  }

  if (status === "RESOLVED") {
    return 86;
  }

  if (status === "IN_PROGRESS") {
    return 64;
  }

  if (status === "PENDING" || status === "ON_HOLD") {
    return 52;
  }

  if (status === "OPEN") {
    return 36;
  }

  return 18;
}

export function TicketDetailsPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id ?? "";
  const { user } = useAuth();

  const ticketQuery = useTicketDetails(ticketId);
  const departmentsQuery = useDepartments();
  const assignTicketMutation = useAssignTicketToSelf(ticketId);
  const closeTicketMutation = useCloseTicket(ticketId);
  const commentsQuery = useTicketComments(ticketId);
  const createCommentMutation = useCreateTicketComment(ticketId);
  const attachmentsQuery = useTicketAttachments(ticketId);
  const uploadAttachmentMutation = useUploadTicketAttachment(ticketId);

  const createCommentErrorMessage = createCommentMutation.isError
    ? getApiErrorMessage(createCommentMutation.error)
    : null;
  const uploadAttachmentErrorMessage = uploadAttachmentMutation.isError
    ? getApiErrorMessage(uploadAttachmentMutation.error)
    : null;
  const assignErrorMessage = assignTicketMutation.isError
    ? getApiErrorMessage(assignTicketMutation.error)
    : null;
  const closeErrorMessage = closeTicketMutation.isError
    ? getApiErrorMessage(closeTicketMutation.error)
    : null;

  if (!ticketId) {
    return <ErrorState message="ID do ticket nao informado." />;
  }

  if (ticketQuery.isLoading || departmentsQuery.isLoading) {
    return <Loading />;
  }

  if (ticketQuery.isError || !ticketQuery.data) {
    return <ErrorState message={getApiErrorMessage(ticketQuery.error)} />;
  }

  if (departmentsQuery.isError) {
    return <ErrorState message={getApiErrorMessage(departmentsQuery.error)} />;
  }

  const ticket = ticketQuery.data.ticket;
  const slaProgress = getSlaProgress(ticket.status);

  const departmentsById = new Map(
    (departmentsQuery.data?.departments ?? []).map((department) => [department.id, department.name])
  );

  const originDepartmentName =
    departmentsById.get(ticket.originDepartmentId) ?? ticket.originDepartmentId;
  const targetDepartmentName =
    departmentsById.get(ticket.targetDepartmentId) ?? ticket.targetDepartmentId;

  const canAssignTicket = Boolean(
    user &&
      !ticket.assignedToUserId &&
      ticket.status !== "CLOSED" &&
      user.departmentId === ticket.targetDepartmentId
  );

  const canCloseTicket = Boolean(
    user &&
      ticket.status !== "CLOSED" &&
      (ticket.assignedToUserId === user.id ||
        (user.role === "MANAGER" && user.departmentId === ticket.targetDepartmentId) ||
        user.role === "ADMIN")
  );

  const assignedToLabel = !ticket.assignedToUserId
    ? "Nao atribuido"
    : user?.id === ticket.assignedToUserId
      ? "Voce"
      : ticket.assignedToUserId;
  const requesterName = ticket.createdByUserName ?? ticket.createdByUserId;

  function handleCreateComment(data: CommentFormData) {
    createCommentMutation.reset();
    return createCommentMutation.mutateAsync({ content: data.content }).then(() => undefined);
  }

  function handleUploadAttachment(file: File) {
    uploadAttachmentMutation.reset();
    return uploadAttachmentMutation.mutateAsync(file).then(() => undefined);
  }

  function handleAssignTicket() {
    assignTicketMutation.reset();
    assignTicketMutation.mutate();
  }

  function handleCloseTicket() {
    closeTicketMutation.reset();
    closeTicketMutation.mutate();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
            aria-label="Voltar"
          >
            <ChevronLeft size={16} />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Chamado #{ticket.id.slice(0, 8)}</h1>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <Button variant="ghost" className="border border-slate-200 bg-white">
          <Printer size={16} />
          Imprimir
        </Button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <Building2 size={12} />
                  Origem
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{originDepartmentName}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <SendHorizontal size={12} />
                  Destino
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{targetDepartmentName}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <User size={12} />
                  Solicitante
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{requesterName}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <Clock3 size={12} />
                  Abertura
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  SLA de atendimento
                </p>
                <p className="text-xs font-semibold text-red-500">
                  {ticket.status === "CLOSED" ? "Finalizado" : "Acompanhando prazo"}
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-400"
                  style={{ width: `${slaProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs italic text-slate-400">
                Prioridade {formatPriority(ticket.priority).toLowerCase()} com status{" "}
                {formatStatus(ticket.status).toLowerCase()}.
              </p>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ClipboardList size={18} className="text-brand-600" />
              Descricao do problema
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">{ticket.description}</p>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                <Paperclip size={12} />
                Anexos ({attachmentsQuery.data?.attachments.length ?? 0})
              </h3>

              {attachmentsQuery.isLoading ? <Loading /> : null}
              {attachmentsQuery.isError ? (
                <ErrorState message={getApiErrorMessage(attachmentsQuery.error)} />
              ) : null}

              {!attachmentsQuery.isLoading && !attachmentsQuery.isError ? (
                attachmentsQuery.data?.attachments.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {attachmentsQuery.data.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={buildAttachmentUrl(attachment.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-brand-500 hover:bg-white"
                      >
                        <p className="truncate text-sm font-semibold text-slate-800">{attachment.fileName}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{attachment.mimeType}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <EmptyState title="Nenhum anexo encontrado" />
                  </div>
                )
              ) : null}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <History size={18} className="text-brand-600" />
              Historico de atividades
            </h2>

            {createCommentErrorMessage ? <ErrorState message={createCommentErrorMessage} /> : null}

            <CreateCommentForm isLoading={createCommentMutation.isPending} onSubmit={handleCreateComment} />

            {commentsQuery.isLoading ? <Loading /> : null}
            {commentsQuery.isError ? (
              <ErrorState message={getApiErrorMessage(commentsQuery.error)} />
            ) : null}

            {!commentsQuery.isLoading && !commentsQuery.isError ? (
              commentsQuery.data?.comments.length ? (
                <div className="relative space-y-4 pl-4 before:absolute before:left-[7px] before:top-1 before:h-[calc(100%-8px)] before:w-px before:bg-slate-200">
                  {commentsQuery.data.comments.map((comment) => (
                    <div key={comment.id} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="absolute -left-[14px] top-4 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-600" />
                      <p className="text-sm text-slate-800">{comment.content}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        <span className="font-semibold">{comment.author.name}</span> - {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Nenhum comentario encontrado" />
              )
            ) : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-[0.06em] text-slate-800">
              <ClipboardList size={18} className="text-brand-600" />
              Acoes do chamado
            </h2>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Status</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
                  {formatStatus(ticket.status)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Prioridade</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
                  {formatPriority(ticket.priority)}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Responsavel</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
                  {assignedToLabel}
                </div>
              </div>
            </div>

            {assignTicketMutation.isSuccess ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Chamado assumido com sucesso.
              </p>
            ) : null}
            {closeTicketMutation.isSuccess ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Chamado concluido com sucesso.
              </p>
            ) : null}
            {assignErrorMessage ? <ErrorState message={assignErrorMessage} /> : null}
            {closeErrorMessage ? <ErrorState message={closeErrorMessage} /> : null}

            <div className="space-y-2 pt-2">
              {canAssignTicket ? (
                <Button
                  onClick={handleAssignTicket}
                  disabled={assignTicketMutation.isPending}
                  className="w-full"
                >
                  {assignTicketMutation.isPending ? "Assumindo..." : "Pegar chamado"}
                </Button>
              ) : null}

              {canCloseTicket ? (
                <Button
                  variant="secondary"
                  onClick={handleCloseTicket}
                  disabled={closeTicketMutation.isPending}
                  className="w-full bg-accent-500 text-slate-900 hover:bg-accent-600"
                >
                  {closeTicketMutation.isPending ? "Concluindo..." : "Marcar como resolvido"}
                </Button>
              ) : null}
            </div>
          </Card>

          <Card className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-slate-600">
              <User size={15} className="text-brand-600" />
              Contato do solicitante
            </h3>
            <p className="text-sm font-semibold text-slate-900">{requesterName}</p>
            <p className="text-xs text-slate-500">Departamento de origem: {originDepartmentName}</p>
            <Button variant="ghost" className="w-full border border-slate-200 bg-white">
              <UserCheck size={16} />
              Abrir chat
            </Button>
          </Card>

          <Card className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-slate-600">
              <Paperclip size={15} className="text-brand-600" />
              Enviar anexo
            </h3>
            {uploadAttachmentErrorMessage ? <ErrorState message={uploadAttachmentErrorMessage} /> : null}
            <UploadAttachmentForm
              isLoading={uploadAttachmentMutation.isPending}
              onSubmit={handleUploadAttachment}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
