import { AppError } from "../../../shared/errors/app-error";

export class UnauthorizedTicketAssignmentError extends AppError {
  constructor() {
    super("Only users from the target department can assign this ticket.", 403);
    this.name = "UnauthorizedTicketAssignmentError";
  }
}
