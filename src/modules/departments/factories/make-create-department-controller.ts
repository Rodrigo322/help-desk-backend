import { CreateDepartmentController } from "../controllers/create-department-controller";

export function makeCreateDepartmentController() {
  return new CreateDepartmentController();
}
