import { ListTicketsController } from "../controllers/list-tickets-controller";

export function makeListTicketsController() {
  const controller = new ListTicketsController();

  return controller;
}

