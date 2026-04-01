import { Router } from "express";

import { authenticate } from "./middlewares/authenticate";
import { authRoutes } from "./modules/auth/routes";
import { departmentsRoutes } from "./modules/departments/routes";
import { notificationsRoutes } from "./modules/notifications/routes";
import { ticketsRoutes } from "./modules/tickets/routes";
import { usersRoutes } from "./modules/users/routes";
import { successResponse } from "./shared/http/api-response";

const routes = Router();

routes.get("/health", (_request, response) => {
  return response.status(200).json(
    successResponse({
      status: "ok"
    })
  );
});

routes.use("/users", usersRoutes);
routes.use("/sessions", authRoutes);
routes.use("/departments", departmentsRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/tickets", ticketsRoutes);

routes.get("/me", authenticate, (request, response) => {
  return response.status(200).json(
    successResponse({
      userId: request.user?.sub,
      departmentId: request.user?.departmentId,
      role: request.user?.role
    })
  );
});

export { routes };
