import { Router } from "express";
import multer from "multer";

import { multerConfig } from "../../configs/multer";
import { makeListTicketAttachmentsController } from "./factories/make-list-ticket-attachments-controller";
import { makeUploadAttachmentController } from "./factories/make-upload-attachment-controller";

const attachmentsRoutes = Router({ mergeParams: true });
const upload = multer({ storage: multerConfig.storage });
const uploadAttachmentController = makeUploadAttachmentController();
const listTicketAttachmentsController = makeListTicketAttachmentsController();

attachmentsRoutes.post("/", upload.single("file"), (request, response, next) => {
  return uploadAttachmentController.handle(request, response, next);
});

attachmentsRoutes.get("/", (request, response, next) => {
  return listTicketAttachmentsController.handle(request, response, next);
});

export { attachmentsRoutes };
