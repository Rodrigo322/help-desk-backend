import { TicketStatus } from "../../types/ticket";
import { formatStatus } from "../../utils/format-status";
import { Badge } from "./badge";

type StatusBadgeProps = {
  status: TicketStatus;
};

function getStatusVariant(status: TicketStatus) {
  if (status === "OPEN") {
    return "info" as const;
  }

  if (status === "IN_PROGRESS") {
    return "warning" as const;
  }

  return "success" as const;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
}

