import { Router } from "express";

import { makeCreateUserController } from "./factories/make-create-user-controller";

const usersRoutes = Router();
const createUserController = makeCreateUserController();

usersRoutes.post("/", (request, response, next) => {
  return createUserController.handle(request, response, next);
});

export { usersRoutes };

