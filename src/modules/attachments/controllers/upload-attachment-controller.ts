import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { multerConfig } from "../../../configs/multer";
import { AppError } from "../../../shared/errors/app-error";
import { successResponse } from "../../../shared/http/api-response";
import { makeUploadAttachmentUseCase } from "../factories/make-upload-attachment-use-case";

const uploadAttachmentBodySchema = z.object({});

const uploadAttachmentParamsSchema = z.object({
  ticketId: z.string().uuid()
});

const uploadAttachmentQuerySchema = z.object({});

export class UploadAttachmentController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      uploadAttachmentBodySchema.parse(request.body ?? {});
      const { ticketId } = uploadAttachmentParamsSchema.parse(request.params);
      uploadAttachmentQuerySchema.parse(request.query);

      const userId = request.user?.sub;

      if (!userId) {
        throw new AppError("Unauthorized.", 401);
      }

      const file = request.file;

      if (!file) {
        throw new AppError("File is required.", 400);
      }

      const uploadAttachmentUseCase = makeUploadAttachmentUseCase();
      const result = await uploadAttachmentUseCase.execute({
        fileName: file.originalname,
        fileUrl: `${multerConfig.fileBaseUrl}/${file.filename}`,
        mimeType: file.mimetype,
        ticketId
      });

      return response.status(201).json(successResponse(result));
    } catch (error) {
      return next(error);
    }
  }
}

