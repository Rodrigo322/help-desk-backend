import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorize-roles";
import { makeCreateDepartmentController } from "./factories/make-create-department-controller";
import { makeGetDepartmentByIdController } from "./factories/make-get-department-by-id-controller";
import { makeListDepartmentsController } from "./factories/make-list-departments-controller";
import { makeUpdateDepartmentController } from "./factories/make-update-department-controller";
import { makeUpdateDepartmentStatusController } from "./factories/make-update-department-status-controller";

const departmentsRoutes = Router();
const createDepartmentController = makeCreateDepartmentController();
const listDepartmentsController = makeListDepartmentsController();
const getDepartmentByIdController = makeGetDepartmentByIdController();
const updateDepartmentController = makeUpdateDepartmentController();
const updateDepartmentStatusController = makeUpdateDepartmentStatusController();

departmentsRoutes.use(authenticate);

departmentsRoutes.post("/", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return createDepartmentController.handle(request, response, next);
});

departmentsRoutes.get("/", (request, response, next) => {
  return listDepartmentsController.handle(request, response, next);
});

departmentsRoutes.get("/:id", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return getDepartmentByIdController.handle(request, response, next);
});

departmentsRoutes.patch("/:id", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return updateDepartmentController.handle(request, response, next);
});

departmentsRoutes.patch("/:id/status", authorizeRoles(["ADMIN"]), (request, response, next) => {
  return updateDepartmentStatusController.handle(request, response, next);
});

export { departmentsRoutes };
