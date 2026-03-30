import { useState } from "react";
import { useParams } from "react-router-dom";

import { CreateCommentForm } from "../../components/forms/create-comment-form";
import { UpdateTicketStatusForm } from "../../components/forms/update-ticket-status-form";
import { UploadAttachmentForm } from "../../components/forms/upload-attachment-form";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { ErrorState } from "../../components/ui/error-state";
import { Loading } from "../../components/ui/loading";
import { useCreateTicketComment, useTicketComments } from "../../hooks/use-ticket-comments";
import { useTicketDetails, useUpdateTicketStatus } from "../../hooks/use-ticket-details";
import {
  useTicketAttachments,
  useUploadTicketAttachment
} from "../../hooks/use-ticket-attachments";
import { CommentFormData } from "../../schemas/tickets/comment-schema";
import { getApiErrorMessage } from "../../services/api";
import { formatDate } from "../../utils/format-date";
import { formatPriority } from "../../utils/format-priority";
import { formatStatus } from "../../utils/format-status";

function getStatusVariant(status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
  if (status === "OPEN") return "info";
  if (status === "IN_PROGRESS") return "warning";
  return "success";
}

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

  const [statusError, setStatusError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const ticketDetailsQuery = useTicketDetails(ticketId);
  const updateStatusMutation = useUpdateTicketStatus(ticketId);
  const commentsQuery = useTicketComments(ticketId);
  const createCommentMutation = useCreateTicketComment(ticketId);
  const attachmentsQuery = useTicketAttachments(ticketId);
  const uploadAttachmentMutation = useUploadTicketAttachment(ticketId);

  if (!ticketId) {
    return <ErrorState message="ID do ticket não informado." />;
  }

  if (ticketDetailsQuery.isLoading) {
    return <Loading />;
  }

  if (ticketDetailsQuery.isError || !ticketDetailsQuery.data) {
    return <ErrorState message="Falha ao carregar detalhes do ticket." />;
  }

  const ticket = ticketDetailsQuery.data.ticket;

  async function handleUpdateStatus(data: { status: "OPEN" | "IN_PROGRESS" | "CLOSED" }) {
    setStatusError(null);

    try {
      await updateStatusMutation.mutateAsync({ status: data.status });
    } catch (error) {
      setStatusError(getApiErrorMessage(error));
    }
  }

  async function handleCreateComment(data: CommentFormData) {
    setCommentError(null);

    try {
      await createCommentMutation.mutateAsync({ content: data.content });
    } catch (error) {
      setCommentError(getApiErrorMessage(error));
    }
  }

  async function handleUploadAttachment(file: File) {
    setAttachmentError(null);

    try {
      await uploadAttachmentMutation.mutateAsync(file);
    } catch (error) {
      setAttachmentError(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{ticket.title}</h1>
        <p className="text-sm text-slate-600">{ticket.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(ticket.status)}>{formatStatus(ticket.status)}</Badge>
          <Badge variant="default">{formatPriority(ticket.priority)}</Badge>
          <span className="text-xs text-slate-500">Criado em {formatDate(ticket.createdAt)}</span>
        </div>
      </header>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Atualizar status</h2>
        {statusError ? <ErrorState message={statusError} /> : null}
        <UpdateTicketStatusForm
          currentStatus={ticket.status}
          isLoading={updateStatusMutation.isPending}
          onSubmit={handleUpdateStatus}
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Comentários</h2>
        {commentError ? <ErrorState message={commentError} /> : null}
        <CreateCommentForm
          isLoading={createCommentMutation.isPending}
          onSubmit={handleCreateComment}
        />

        {commentsQuery.isLoading ? <Loading /> : null}
        {commentsQuery.isError ? <ErrorState message="Falha ao carregar comentários." /> : null}

        {!commentsQuery.isLoading && !commentsQuery.isError ? (
          commentsQuery.data?.comments.length ? (
            <div className="space-y-3">
              {commentsQuery.data.comments.map((comment) => (
                <div key={comment.id} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm text-slate-800">{comment.content}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {comment.author.name} - {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum comentário" />
          )
        ) : null}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Anexos</h2>
        {attachmentError ? <ErrorState message={attachmentError} /> : null}
        <UploadAttachmentForm
          isLoading={uploadAttachmentMutation.isPending}
          onSubmit={handleUploadAttachment}
        />

        {attachmentsQuery.isLoading ? <Loading /> : null}
        {attachmentsQuery.isError ? <ErrorState message="Falha ao carregar anexos." /> : null}

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
                  <p className="text-xs text-slate-500">{attachment.mimeType}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nenhum anexo" />
          )
        ) : null}
      </Card>
    </div>
  );
}

