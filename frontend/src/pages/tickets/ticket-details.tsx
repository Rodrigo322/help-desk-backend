import { useParams } from "react-router-dom";

import { CreateCommentForm } from "../../components/forms/create-comment-form";
import { UpdateTicketStatusForm } from "../../components/forms/update-ticket-status-form";
import { UploadAttachmentForm } from "../../components/forms/upload-attachment-form";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { PriorityBadge } from "../../components/ui/priority-badge";
import { StatusBadge } from "../../components/ui/status-badge";
import {
  useTicketAttachments,
  useUploadTicketAttachment
} from "../../hooks/use-ticket-attachments";
import { useCreateTicketComment, useTicketComments } from "../../hooks/use-ticket-comments";
import { useTicketDetails, useUpdateTicketStatus } from "../../hooks/use-ticket-details";
import { CommentFormData } from "../../schemas/tickets/comment-schema";
import { UpdateTicketStatusFormData } from "../../schemas/tickets/update-ticket-status-schema";
import { getApiErrorMessage } from "../../services/api";
import { formatDate } from "../../utils/format-date";

function buildAttachmentUrl(fileUrl: string): string {
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333/v1";
  const baseWithoutVersion = apiBaseUrl.replace(/\/v1\/?$/, "");

  return `${baseWithoutVersion}${fileUrl}`;
}

export function TicketDetailsPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id ?? "";

  const ticketQuery = useTicketDetails(ticketId);
  const updateTicketStatusMutation = useUpdateTicketStatus(ticketId);
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
  const updateStatusErrorMessage = updateTicketStatusMutation.isError
    ? getApiErrorMessage(updateTicketStatusMutation.error)
    : null;

  if (!ticketId) {
    return <ErrorState message="ID do ticket nao informado." />;
  }

  if (ticketQuery.isLoading) {
    return <Loading />;
  }

  if (ticketQuery.isError || !ticketQuery.data) {
    return <ErrorState message="Nao foi possivel carregar os detalhes do ticket." />;
  }

  const ticket = ticketQuery.data.ticket;

  function handleCreateComment(data: CommentFormData) {
    createCommentMutation.reset();
    return createCommentMutation.mutateAsync({ content: data.content }).then(() => undefined);
  }

  function handleUploadAttachment(file: File) {
    uploadAttachmentMutation.reset();
    return uploadAttachmentMutation.mutateAsync(file).then(() => undefined);
  }

  function handleUpdateStatus(data: UpdateTicketStatusFormData) {
    updateTicketStatusMutation.reset();
    return updateTicketStatusMutation.mutateAsync({ status: data.status }).then(() => undefined);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{ticket.title}</h1>
        <p className="text-sm text-slate-600">{ticket.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <span className="text-xs text-slate-500">Criado em {formatDate(ticket.createdAt)}</span>
        </div>
      </header>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Status do chamado</h2>
        <p className="text-sm text-slate-600">Atualize o status seguindo as regras de transicao.</p>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Status atual
          </p>
          <StatusBadge status={ticket.status} />
        </div>

        {updateTicketStatusMutation.isSuccess ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Status atualizado com sucesso.
          </p>
        ) : null}

        {updateStatusErrorMessage ? <ErrorState message={updateStatusErrorMessage} /> : null}

        <UpdateTicketStatusForm
          currentStatus={ticket.status}
          isLoading={updateTicketStatusMutation.isPending}
          onSubmit={handleUpdateStatus}
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Comentarios</h2>

        {createCommentErrorMessage ? <ErrorState message={createCommentErrorMessage} /> : null}

        <CreateCommentForm
          isLoading={createCommentMutation.isPending}
          onSubmit={handleCreateComment}
        />

        {commentsQuery.isLoading ? <Loading /> : null}
        {commentsQuery.isError ? <ErrorState message="Nao foi possivel carregar os comentarios." /> : null}

        {!commentsQuery.isLoading && !commentsQuery.isError ? (
          commentsQuery.data?.comments.length ? (
            <div className="space-y-3">
              {commentsQuery.data.comments.map((comment) => (
                <div key={comment.id} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm text-slate-800">{comment.content}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {comment.author.name} - {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum comentario encontrado" />
          )
        ) : null}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Anexos</h2>

        {uploadAttachmentErrorMessage ? <ErrorState message={uploadAttachmentErrorMessage} /> : null}

        <UploadAttachmentForm
          isLoading={uploadAttachmentMutation.isPending}
          onSubmit={handleUploadAttachment}
        />

        {attachmentsQuery.isLoading ? <Loading /> : null}
        {attachmentsQuery.isError ? <ErrorState message="Nao foi possivel carregar os anexos." /> : null}

        {!attachmentsQuery.isLoading && !attachmentsQuery.isError ? (
          attachmentsQuery.data?.attachments.length ? (
            <ul className="space-y-2">
              {attachmentsQuery.data.attachments.map((attachment) => (
                <li key={attachment.id} className="rounded-md border border-slate-200 p-3">
                  <a
                    className="text-sm font-medium text-brand-700 underline"
                    href={buildAttachmentUrl(attachment.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {attachment.fileName}
                  </a>
                  {attachment.fileUrl ? (
                    <p className="mt-1 text-xs text-slate-500">URL: {attachment.fileUrl}</p>
                  ) : null}
                  <p className="text-xs text-slate-500">{attachment.mimeType}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nenhum anexo encontrado" />
          )
        ) : null}
      </Card>
    </div>
  );
}
