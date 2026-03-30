import { Router } from "express";

import { makeAuthenticateController } from "./factories/make-authenticate-controller";

const authRoutes = Router();
const authenticateController = makeAuthenticateController();

authRoutes.post("/", (request, response, next) => {
  return authenticateController.handle(request, response, next);
});

export { authRoutes };

