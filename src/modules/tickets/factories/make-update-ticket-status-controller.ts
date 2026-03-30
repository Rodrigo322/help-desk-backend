import { UpdateTicketStatusController } from "../controllers/update-ticket-status-controller";

export function makeUpdateTicketStatusController() {
  const controller = new UpdateTicketStatusController();

  return controller;
}

