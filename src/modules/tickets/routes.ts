import { Router } from "express";

import { attachmentsRoutes } from "../attachments/routes";
import { makeListTicketAuditLogsController } from "../auditlogs/factories/make-list-ticket-audit-logs-controller";
import { authenticate } from "../../middlewares/authenticate";
import { commentsRoutes } from "../comments/routes";
import { makeAssignTicketToSelfController } from "./factories/make-assign-ticket-to-self-controller";
import { makeCloseTicketController } from "./factories/make-close-ticket-controller";
import { makeCreateTicketController } from "./factories/make-create-ticket-controller";
import { makeGetTicketByIdController } from "./factories/make-get-ticket-by-id-controller";
import { makeListDepartmentTicketsController } from "./factories/make-list-department-tickets-controller";
import { makeListMyAssignedTicketsController } from "./factories/make-list-my-assigned-tickets-controller";
import { makeListMyCreatedTicketsController } from "./factories/make-list-my-created-tickets-controller";
import { makeResolveTicketController } from "./factories/make-resolve-ticket-controller";
import { makeUpdateTicketPriorityController } from "./factories/make-update-ticket-priority-controller";

const ticketsRoutes = Router();
const createTicketController = makeCreateTicketController();
const listDepartmentTicketsController = makeListDepartmentTicketsController();
const listMyCreatedTicketsController = makeListMyCreatedTicketsController();
const listMyAssignedTicketsController = makeListMyAssignedTicketsController();
const getTicketByIdController = makeGetTicketByIdController();
const assignTicketToSelfController = makeAssignTicketToSelfController();
const resolveTicketController = makeResolveTicketController();
const closeTicketController = makeCloseTicketController();
const updateTicketPriorityController = makeUpdateTicketPriorityController();
const listTicketAuditLogsController = makeListTicketAuditLogsController();

ticketsRoutes.use(authenticate);

ticketsRoutes.post("/", (request, response, next) => {
  return createTicketController.handle(request, response, next);
});

ticketsRoutes.get("/", (request, response, next) => {
  return listDepartmentTicketsController.handle(request, response, next);
});

ticketsRoutes.get("/me/created", (request, response, next) => {
  return listMyCreatedTicketsController.handle(request, response, next);
});

ticketsRoutes.get("/me/assigned", (request, response, next) => {
  return listMyAssignedTicketsController.handle(request, response, next);
});

ticketsRoutes.get("/:id", (request, response, next) => {
  return getTicketByIdController.handle(request, response, next);
});

ticketsRoutes.post("/:id/assign", (request, response, next) => {
  return assignTicketToSelfController.handle(request, response, next);
});

ticketsRoutes.patch("/:id/resolve", (request, response, next) => {
  return resolveTicketController.handle(request, response, next);
});

ticketsRoutes.patch("/:id/close", (request, response, next) => {
  return closeTicketController.handle(request, response, next);
});

ticketsRoutes.patch("/:id/priority", (request, response, next) => {
  return updateTicketPriorityController.handle(request, response, next);
});

ticketsRoutes.get("/:ticketId/audit-logs", (request, response, next) => {
  return listTicketAuditLogsController.handle(request, response, next);
});

ticketsRoutes.use("/:ticketId/comments", commentsRoutes);
ticketsRoutes.use("/:ticketId/attachments", attachmentsRoutes);

export { ticketsRoutes };
