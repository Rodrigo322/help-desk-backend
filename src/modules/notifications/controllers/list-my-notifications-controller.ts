import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeListMyNotificationsUseCase } from "../factories/make-list-my-notifications-use-case";

const listMyNotificationsBodySchema = z.object({});
const listMyNotificationsParamsSchema = z.object({});
const listMyNotificationsQuerySchema = z.object({});

export class ListMyNotificationsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      listMyNotificationsBodySchema.parse(request.body ?? {});
      listMyNotificationsParamsSchema.parse(request.params);
      listMyNotificationsQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const listMyNotificationsUseCase = makeListMyNotificationsUseCase();
      const result = await listMyNotificationsUseCase.execute({ userId });

      return response.status(200).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}
