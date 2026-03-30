import { CreateTicketController } from "../controllers/create-ticket-controller";

export function makeCreateTicketController() {
  const controller = new CreateTicketController();

  return controller;
}

