import { AppError } from "../../../shared/errors/app-error";

export class DepartmentManagerNotFoundError extends AppError {
  constructor(departmentId: string) {
    super(`Department manager not found for department ${departmentId}.`, 422);
    this.name = "DepartmentManagerNotFoundError";
  }
}
