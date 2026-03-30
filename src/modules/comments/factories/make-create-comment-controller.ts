import { CreateCommentController } from "../controllers/create-comment-controller";

export function makeCreateCommentController() {
  const controller = new CreateCommentController();

  return controller;
}

