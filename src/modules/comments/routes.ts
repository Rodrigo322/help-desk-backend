import { Router } from "express";

import { makeCreateCommentController } from "./factories/make-create-comment-controller";
import { makeListTicketCommentsController } from "./factories/make-list-ticket-comments-controller";

const commentsRoutes = Router({ mergeParams: true });
const createCommentController = makeCreateCommentController();
const listTicketCommentsController = makeListTicketCommentsController();

commentsRoutes.post("/", (request, response, next) => {
  return createCommentController.handle(request, response, next);
});

commentsRoutes.get("/", (request, response, next) => {
  return listTicketCommentsController.handle(request, response, next);
});

export { commentsRoutes };
