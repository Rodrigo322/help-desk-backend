import { Router } from "express";

import { attachmentsRoutes } from "../attachments/routes";
import { authenticate } from "../../middlewares/authenticate";
import { commentsRoutes } from "../comments/routes";
import { makeCreateTicketController } from "./factories/make-create-ticket-controller";
import { makeGetTicketByIdController } from "./factories/make-get-ticket-by-id-controller";
import { makeListTicketsController } from "./factories/make-list-tickets-controller";
import { makeUpdateTicketStatusController } from "./factories/make-update-ticket-status-controller";

const ticketsRoutes = Router();
const createTicketController = makeCreateTicketController();
const listTicketsController = makeListTicketsController();
const getTicketByIdController = makeGetTicketByIdController();
const updateTicketStatusController = makeUpdateTicketStatusController();

ticketsRoutes.use(authenticate);

ticketsRoutes.post("/", (request, response, next) => {
  return createTicketController.handle(request, response, next);
});

ticketsRoutes.get("/", (request, response, next) => {
  return listTicketsController.handle(request, response, next);
});

ticketsRoutes.get("/:id", (request, response, next) => {
  return getTicketByIdController.handle(request, response, next);
});

ticketsRoutes.patch("/:id/status", (request, response, next) => {
  return updateTicketStatusController.handle(request, response, next);
});

ticketsRoutes.use("/:ticketId/comments", commentsRoutes);
ticketsRoutes.use("/:ticketId/attachments", attachmentsRoutes);

export { ticketsRoutes };
