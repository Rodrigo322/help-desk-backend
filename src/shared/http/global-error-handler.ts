import { ErrorRequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";
import { ApiErrorResponse } from "./api-response";

function formatError(message: string): ApiErrorResponse {
  return {
    success: false,
    error: { message }
  };
}

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json(formatError(error.message));
  }

  if (error instanceof ZodError) {
    return response.status(400).json(formatError("Validation failed."));
  }

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    return response.status(401).json(formatError("Invalid token."));
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "code" in error &&
    error.name === "PrismaClientKnownRequestError"
  ) {
    if (error.code === "P2002") {
      return response.status(409).json(formatError("Resource already exists."));
    }

    return response.status(400).json(formatError("Database request error."));
  }

  return response.status(500).json(formatError("Internal server error."));
};
