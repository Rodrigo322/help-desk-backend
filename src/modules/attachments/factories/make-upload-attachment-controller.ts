import { UploadAttachmentController } from "../controllers/upload-attachment-controller";

export function makeUploadAttachmentController() {
  const controller = new UploadAttachmentController();

  return controller;
}

