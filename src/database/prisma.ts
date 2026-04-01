import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

function resolveDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma Client.");
  }

  return databaseUrl;
}

function shouldUseSsl(databaseUrl: string): boolean {
  return databaseUrl.includes("sslmode=require") || databaseUrl.includes("ssl=true");
}

const databaseUrl = resolveDatabaseUrl();
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
