import { ListTicketAttachmentsController } from "../controllers/list-ticket-attachments-controller";

export function makeListTicketAttachmentsController() {
  const controller = new ListTicketAttachmentsController();

  return controller;
}

