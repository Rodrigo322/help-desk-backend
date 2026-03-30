import { ListTicketCommentsController } from "../controllers/list-ticket-comments-controller";

export function makeListTicketCommentsController() {
  const controller = new ListTicketCommentsController();

  return controller;
}

