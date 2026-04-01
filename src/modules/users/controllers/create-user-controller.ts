import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { successResponse } from "../../../shared/http/api-response";
import { USER_ROLE_VALUES } from "../entities/user";
import { makeCreateUserUseCase } from "../factories/make-create-user-use-case";

const createUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  departmentId: z.string().uuid(),
  role: z.enum(USER_ROLE_VALUES).default("EMPLOYEE")
});

const createUserParamsSchema = z.object({});
const createUserQuerySchema = z.object({});

export class CreateUserController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, email, password, departmentId, role } = createUserBodySchema.parse(
        request.body
      );
      createUserParamsSchema.parse(request.params);
      createUserQuerySchema.parse(request.query);

      const createUserUseCase = makeCreateUserUseCase();
      const result = await createUserUseCase.execute({
        name,
        email,
        password,
        departmentId,
        role
      });

      return response.status(201).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
