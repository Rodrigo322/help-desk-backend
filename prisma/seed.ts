import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

type SeedAdminInput = {
  name: string;
  email: string;
  password: string;
};

const prisma = new PrismaClient();

const fallbackAdmin: SeedAdminInput = {
  name: "Local Admin",
  email: "admin@local.dev",
  password: "Admin@123456"
};

function resolveAdminInput(): SeedAdminInput {
  const envAdmin = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  };

  const isProduction = process.env.NODE_ENV === "production";
  const hasCompleteAdminEnv =
    !!envAdmin.name?.trim() && !!envAdmin.email?.trim() && !!envAdmin.password?.trim();

  if (isProduction && !hasCompleteAdminEnv) {
    throw new Error(
      "Missing admin environment variables in production. Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD."
    );
  }

  if (hasCompleteAdminEnv) {
    return {
      name: envAdmin.name!,
      email: envAdmin.email!,
      password: envAdmin.password!
    };
  }

  return fallbackAdmin;
}

async function main() {
  const admin = resolveAdminInput();
  const hashedPassword = await hash(admin.password, 10);

  const user = await prisma.user.upsert({
    where: {
      email: admin.email
    },
    update: {
      name: admin.name,
      password: hashedPassword
    },
    create: {
      name: admin.name,
      email: admin.email,
      password: hashedPassword
    }
  });

  console.log(`Admin seed completed: ${user.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

