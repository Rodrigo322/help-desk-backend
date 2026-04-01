import { GetDepartmentByIdController } from "../controllers/get-department-by-id-controller";

export function makeGetDepartmentByIdController() {
  return new GetDepartmentByIdController();
}
