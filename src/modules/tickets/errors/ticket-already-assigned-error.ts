import { AppError } from "../../../shared/errors/app-error";

export class TicketAlreadyAssignedError extends AppError {
  constructor() {
    super("Ticket already assigned.", 409);
    this.name = "TicketAlreadyAssignedError";
  }
}
