import { NextFunction, Request, Response } from "express";

import { loadEnvironmentConfig } from "./env";

const environment = loadEnvironmentConfig();
const allowedOrigins = environment.CORS_ALLOWED_ORIGINS;
const allowAnyOrigin = allowedOrigins.includes("*");

export function corsMiddleware(request: Request, response: Response, next: NextFunction) {
  const origin = request.headers.origin;

  if (!allowAnyOrigin && origin && !allowedOrigins.includes(origin)) {
    return response.status(403).json({
      success: false,
      error: {
        message: "CORS origin not allowed."
      }
    });
  }

  if (allowAnyOrigin) {
    response.header("Access-Control-Allow-Origin", "*");
  } else if (origin) {
    response.header("Access-Control-Allow-Origin", origin);
    response.header("Access-Control-Allow-Credentials", "true");
    response.header("Vary", "Origin");
  }

  response.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  return next();
}
