import { ListUsersController } from "../controllers/list-users-controller";

export function makeListUsersController() {
  return new ListUsersController();
}
