import { AppError } from "../../../shared/errors/app-error";

export class UnauthorizedTicketCloseError extends AppError {
  constructor() {
    super("Only the assignee or an authorized manager can close this ticket.", 403);
    this.name = "UnauthorizedTicketCloseError";
  }
}
