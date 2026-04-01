import { ListTicketsController } from "../controllers/list-tickets-controller";

export function makeListDepartmentTicketsController() {
  return new ListTicketsController();
}
