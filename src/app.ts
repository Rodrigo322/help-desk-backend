import express from "express";

import { corsMiddleware } from "./configs/cors";
import { loadEnvironmentConfig } from "./configs/env";
import { multerConfig } from "./configs/multer";
import { routes } from "./routes";
import { globalErrorHandler } from "./shared/http/global-error-handler";

const app = express();
const environment = loadEnvironmentConfig();
const isProduction = environment.NODE_ENV === "production";

app.disable("x-powered-by");

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(corsMiddleware);
app.use(express.json());
app.use("/uploads", express.static(multerConfig.uploadDirectory));
app.use("/v1", routes);
app.use(globalErrorHandler);

export { app };
