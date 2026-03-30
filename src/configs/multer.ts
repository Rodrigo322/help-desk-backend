import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

import multer from "multer";

const uploadDirectory = path.resolve(process.cwd(), "uploads");

mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_request, file, callback) => {
    const fileName = `${randomUUID()}-${file.originalname}`;
    callback(null, fileName);
  }
});

const multerConfig = {
  uploadDirectory,
  fileBaseUrl: "/uploads",
  storage
};

export { multerConfig };

