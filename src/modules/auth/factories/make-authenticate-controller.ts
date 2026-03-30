import { AuthenticateController } from "../controllers/authenticate-controller";

export function makeAuthenticateController() {
  const controller = new AuthenticateController();

  return controller;
}
