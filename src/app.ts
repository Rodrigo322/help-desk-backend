import "dotenv/config";
import express from "express";

import { multerConfig } from "./configs/multer";
import { routes } from "./routes";
import { globalErrorHandler } from "./shared/http/global-error-handler";

const app = express();

app.use(express.json());
app.use("/uploads", express.static(multerConfig.uploadDirectory));
app.use("/v1", routes);
app.use(globalErrorHandler);

export { app };
