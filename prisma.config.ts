import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL?.trim();
const directUrl = process.env.DIRECT_URL?.trim();
const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required in prisma.config.ts.");
}

if (!directUrl) {
  throw new Error("DIRECT_URL is required in prisma.config.ts.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
    directUrl,
    ...(shadowDatabaseUrl ? { shadowDatabaseUrl } : {})
  }
});
