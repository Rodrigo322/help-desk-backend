import "dotenv/config";

import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required."),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required.")
});

type EnvironmentConfig = {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
  CORS_ALLOWED_ORIGINS: string[];
};

let cachedEnvironment: EnvironmentConfig | null = null;

function parseAllowedOrigins(rawOrigins: string): string[] {
  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function loadEnvironmentConfig(): EnvironmentConfig {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const parsedEnvironment = environmentSchema.safeParse(process.env);

  if (!parsedEnvironment.success) {
    const details = parsedEnvironment.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n- ");

    throw new Error(`[bootstrap] Invalid environment configuration:\n- ${details}`);
  }

  const allowedOrigins = parseAllowedOrigins(parsedEnvironment.data.CORS_ORIGIN);

  if (!allowedOrigins.length) {
    throw new Error(
      "[bootstrap] Invalid environment configuration:\n- CORS_ORIGIN: provide at least one origin."
    );
  }

  cachedEnvironment = {
    ...parsedEnvironment.data,
    CORS_ALLOWED_ORIGINS: allowedOrigins
  };

  if (cachedEnvironment.NODE_ENV === "production" && allowedOrigins.includes("*")) {
    console.warn("[bootstrap] CORS_ORIGIN contains '*' in production. Restrict this value if possible.");
  }

  return cachedEnvironment;
}
