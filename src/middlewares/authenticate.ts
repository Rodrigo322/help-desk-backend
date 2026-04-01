import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "../shared/errors/app-error";

type TokenPayload = {
  sub: string;
  departmentId?: string;
  role?: "EMPLOYEE" | "MANAGER" | "ADMIN";
};

export function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("JWT secret is not configured.", 500);
  }

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token not provided.", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Invalid authorization header.", 401);
  }

  try {
    const decoded = verify(token, jwtSecret) as TokenPayload;

    request.user = {
      sub: decoded.sub,
      departmentId: decoded.departmentId,
      role: decoded.role
    };

    return next();
  } catch {
    throw new AppError("Invalid token.", 401);
  }
}
