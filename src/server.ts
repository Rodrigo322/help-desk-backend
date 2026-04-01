import { loadEnvironmentConfig } from "./configs/env";

async function bootstrap() {
  try {
    const environment = loadEnvironmentConfig();
    const { app } = await import("./app");

    const host = "0.0.0.0";
    const server = app.listen(environment.PORT, host, () => {
      console.log(
        `[bootstrap] HTTP server started | env=${environment.NODE_ENV} | host=${host} | port=${environment.PORT}`
      );
    });

    server.on("error", (error) => {
      console.error("[bootstrap] Failed to start HTTP server:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("[runtime] Unhandled rejection:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("[runtime] Uncaught exception:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("[bootstrap] Startup aborted due to invalid configuration.");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void bootstrap();
