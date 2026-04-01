import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { makeAuthenticateUseCase } from "../factories/make-authenticate-use-case";

const authenticateBodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

const authenticateParamsSchema = z.object({});
const authenticateQuerySchema = z.object({});

export class AuthenticateController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = authenticateBodySchema.parse(request.body);
      authenticateParamsSchema.parse(request.params);
      authenticateQuerySchema.parse(request.query);

      const authenticateUseCase = makeAuthenticateUseCase();
      const result = await authenticateUseCase.execute({ email, password });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
