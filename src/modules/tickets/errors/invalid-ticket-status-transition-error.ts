import { AppError } from "../../../shared/errors/app-error";
import { TicketStatus } from "../entities/ticket";

export class InvalidTicketStatusTransitionError extends AppError {
  constructor(currentStatus: TicketStatus, nextStatus: TicketStatus) {
    super(
      `Invalid ticket status transition from ${currentStatus} to ${nextStatus}.`,
      422
    );
    this.name = "InvalidTicketStatusTransitionError";
  }
}

