import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorize-roles";
import { makeCreateUserController } from "./factories/make-create-user-controller";
import { makeGetUserByIdController } from "./factories/make-get-user-by-id-controller";
import { makeListUsersController } from "./factories/make-list-users-controller";
import { makeUpdateUserController } from "./factories/make-update-user-controller";
import { makeUpdateUserStatusController } from "./factories/make-update-user-status-controller";

const usersRoutes = Router();
const createUserController = makeCreateUserController();
const listUsersController = makeListUsersController();
const getUserByIdController = makeGetUserByIdController();
const updateUserController = makeUpdateUserController();
const updateUserStatusController = makeUpdateUserStatusController();

usersRoutes.use(authenticate);

usersRoutes.get("/", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return listUsersController.handle(request, response, next);
});

usersRoutes.post("/", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return createUserController.handle(request, response, next);
});

usersRoutes.get("/:id", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return getUserByIdController.handle(request, response, next);
});

usersRoutes.patch("/:id", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return updateUserController.handle(request, response, next);
});

usersRoutes.patch("/:id/status", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return updateUserStatusController.handle(request, response, next);
});

export { usersRoutes };
