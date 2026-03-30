import { GetTicketByIdController } from "../controllers/get-ticket-by-id-controller";

export function makeGetTicketByIdController() {
  const controller = new GetTicketByIdController();

  return controller;
}

