import { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/app-error";

type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

export function authorizeRoles(roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const role = request.user?.role;

    if (!request.user?.sub || !role) {
      throw new AppError("Unauthorized.", 401);
    }

    if (!roles.includes(role)) {
      throw new AppError("Forbidden.", 403);
    }

    return next();
  };
}
