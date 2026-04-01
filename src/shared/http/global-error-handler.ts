import { ErrorRequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";
import { ApiErrorResponse } from "./api-response";

function logError(message: string, error?: unknown) {
  const timestamp = new Date().toISOString();

  if (error) {
    console.error(`[${timestamp}] ${message}`, error);
    return;
  }

  console.error(`[${timestamp}] ${message}`);
}

function formatError(message: string): ApiErrorResponse {
  return {
    success: false,
    error: { message }
  };
}

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logError(`[error] ${request.method} ${request.originalUrl} | ${error.message}`);
    }

    return response.status(error.statusCode).json(formatError(error.message));
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];

    if (!firstIssue) {
      return response.status(400).json(formatError("Validation failed."));
    }

    const path = firstIssue.path.join(".");
    const message = path ? `Validation failed on "${path}": ${firstIssue.message}` : `Validation failed: ${firstIssue.message}`;

    return response.status(400).json(formatError(message));
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

  logError(`[error] ${request.method} ${request.originalUrl} | Unexpected error.`, error);

  if (error instanceof Error && error.stack) {
    logError(`[error] stack | ${error.stack}`);
  }

  return response.status(500).json(formatError("Internal server error."));
};
