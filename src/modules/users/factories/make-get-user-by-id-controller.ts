import { GetUserByIdController } from "../controllers/get-user-by-id-controller";

export function makeGetUserByIdController() {
  return new GetUserByIdController();
}
