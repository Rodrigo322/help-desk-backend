import { CreateUserController } from "../controllers/create-user-controller";

export function makeCreateUserController() {
  const controller = new CreateUserController();

  return controller;
}
