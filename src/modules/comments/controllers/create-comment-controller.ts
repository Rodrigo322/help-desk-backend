import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeCreateCommentUseCase } from "../factories/make-create-comment-use-case";

const createCommentBodySchema = z.object({
  content: z.string().min(1)
});

const createCommentParamsSchema = z.object({
  ticketId: z.string().uuid()
});

const createCommentQuerySchema = z.object({});

export class CreateCommentController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { content } = createCommentBodySchema.parse(request.body);
      const { ticketId } = createCommentParamsSchema.parse(request.params);
      createCommentQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const createCommentUseCase = makeCreateCommentUseCase();
      const result = await createCommentUseCase.execute({
        content,
        ticketId,
        userId
      });

      return response.status(201).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}

