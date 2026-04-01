import { TicketStatus } from "../../types/ticket";
import { formatStatus } from "../../utils/format-status";
import { Badge } from "./badge";

type StatusBadgeProps = {
  status: TicketStatus;
};

function getStatusVariant(status: TicketStatus) {
  if (status === "NEW" || status === "OPEN") {
    return "info" as const;
  }

  if (status === "IN_PROGRESS" || status === "PENDING" || status === "ON_HOLD") {
    return "warning" as const;
  }

  if (status === "RESOLVED") {
    return "success" as const;
  }

  if (status === "CLOSED") {
    return "default" as const;
  }

  return "success" as const;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{formatStatus(status)}</Badge>;
}
