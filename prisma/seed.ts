import "dotenv/config";

import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

import { prisma } from "../src/database/prisma";

type SeedPrivilegedUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  departmentName: string;
};

const fallbackMasterUser: SeedPrivilegedUserInput = {
  name: "Master Admin",
  email: "master@local.dev",
  password: "Master@123456",
  role: "ADMIN",
  departmentName: "Operations"
};

const fallbackLocalAdminUser: SeedPrivilegedUserInput = {
  name: "Local Admin",
  email: "admin@local.dev",
  password: "admin123456",
  role: "ADMIN",
  departmentName: "General"
};

function normalizeRole(value: string | undefined): UserRole {
  if (value?.trim() === "MANAGER") {
    return "MANAGER";
  }

  if (value?.trim() === "EMPLOYEE") {
    return "EMPLOYEE";
  }

  return "ADMIN";
}

function resolveMasterInput(): SeedPrivilegedUserInput {
  const envMaster = {
    name: process.env.MASTER_NAME ?? process.env.ADMIN_NAME,
    email: process.env.MASTER_EMAIL ?? process.env.ADMIN_EMAIL,
    password: process.env.MASTER_PASSWORD ?? process.env.ADMIN_PASSWORD,
    role: process.env.MASTER_ROLE ?? process.env.ADMIN_ROLE,
    departmentName: process.env.MASTER_DEPARTMENT ?? process.env.ADMIN_DEPARTMENT
  };

  const isProduction = process.env.NODE_ENV === "production";
  const hasCompleteMasterEnv =
    !!envMaster.name?.trim() && !!envMaster.email?.trim() && !!envMaster.password?.trim();

  if (isProduction && !hasCompleteMasterEnv) {
    throw new Error(
      "Missing master environment variables in production. Set MASTER_NAME, MASTER_EMAIL and MASTER_PASSWORD."
    );
  }

  if (hasCompleteMasterEnv) {
    return {
      name: envMaster.name!.trim(),
      email: envMaster.email!.trim(),
      password: envMaster.password!.trim(),
      role: normalizeRole(envMaster.role),
      departmentName: envMaster.departmentName?.trim() || fallbackMasterUser.departmentName
    };
  }

  return fallbackMasterUser;
}

async function upsertPrivilegedUser(input: SeedPrivilegedUserInput) {
  const hashedPassword = await hash(input.password, 10);

  const department = await prisma.department.upsert({
    where: {
      name: input.departmentName
    },
    update: {
      isActive: true
    },
    create: {
      name: input.departmentName,
      isActive: true
    }
  });

  const user = await prisma.user.upsert({
    where: {
      email: input.email
    },
    update: {
      name: input.name,
      password: hashedPassword,
      role: input.role,
      departmentId: department.id,
      isActive: true
    },
    create: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      departmentId: department.id,
      isActive: true
    }
  });

  await prisma.department.update({
    where: {
      id: department.id
    },
    data: {
      managerUserId: user.id
    }
  });

  return { user, department };
}

async function main() {
  const masterInput = resolveMasterInput();
  const { user, department } = await upsertPrivilegedUser(masterInput);

  console.log(`Master seed completed: ${user.email} | role=${user.role} | department=${department.name}`);

  if (process.env.NODE_ENV !== "production" && masterInput.email !== fallbackLocalAdminUser.email) {
    const localAdmin = await upsertPrivilegedUser(fallbackLocalAdminUser);

    console.log(
      `Local admin seed completed: ${localAdmin.user.email} | role=${localAdmin.user.role} | department=${localAdmin.department.name}`
    );
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
