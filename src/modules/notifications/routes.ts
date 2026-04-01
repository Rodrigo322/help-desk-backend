import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate";
import { makeListMyNotificationsController } from "./factories/make-list-my-notifications-controller";

const notificationsRoutes = Router();
const listMyNotificationsController = makeListMyNotificationsController();

notificationsRoutes.use(authenticate);

notificationsRoutes.get("/me", (request, response, next) => {
  return listMyNotificationsController.handle(request, response, next);
});

export { notificationsRoutes };
