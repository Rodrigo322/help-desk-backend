import { TicketPriority } from "../../types/ticket";
import { formatPriority } from "../../utils/format-priority";
import { Badge } from "./badge";

type PriorityBadgeProps = {
  priority: TicketPriority;
};

function getPriorityVariant(priority: TicketPriority) {
  if (priority === "HIGH") {
    return "danger" as const;
  }

  if (priority === "MEDIUM") {
    return "warning" as const;
  }

  return "default" as const;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <Badge variant={getPriorityVariant(priority)}>{formatPriority(priority)}</Badge>;
}

