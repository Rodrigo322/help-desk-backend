-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "managerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipientUserId" TEXT NOT NULL,
    "ticketId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Seed fallback department for existing users and legacy tickets
INSERT INTO "Department" ("id", "name", "createdAt", "updatedAt")
SELECT 'default-department', 'General', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1
  FROM "Department"
  WHERE "name" = 'General'
);

-- AlterTable User
ALTER TABLE "User"
    ADD COLUMN "departmentId" TEXT,
    ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE';

UPDATE "User"
SET "departmentId" = 'default-department'
WHERE "departmentId" IS NULL;

ALTER TABLE "User"
    ALTER COLUMN "departmentId" SET NOT NULL;

-- AlterTable Ticket
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

DROP INDEX "Ticket_userId_idx";

ALTER TABLE "Ticket" RENAME COLUMN "userId" TO "createdByUserId";

ALTER TABLE "Ticket"
    ADD COLUMN "originDepartmentId" TEXT,
    ADD COLUMN "targetDepartmentId" TEXT,
    ADD COLUMN "assignedToUserId" TEXT,
    ADD COLUMN "closedByUserId" TEXT;

UPDATE "Ticket" AS t
SET
    "originDepartmentId" = u."departmentId",
    "targetDepartmentId" = u."departmentId"
FROM "User" AS u
WHERE t."createdByUserId" = u."id";

ALTER TABLE "Ticket"
    ALTER COLUMN "originDepartmentId" SET NOT NULL,
    ALTER COLUMN "targetDepartmentId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Department_managerUserId_idx" ON "Department"("managerUserId");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Ticket_createdByUserId_idx" ON "Ticket"("createdByUserId");

-- CreateIndex
CREATE INDEX "Ticket_originDepartmentId_idx" ON "Ticket"("originDepartmentId");

-- CreateIndex
CREATE INDEX "Ticket_targetDepartmentId_idx" ON "Ticket"("targetDepartmentId");

-- CreateIndex
CREATE INDEX "Ticket_assignedToUserId_idx" ON "Ticket"("assignedToUserId");

-- CreateIndex
CREATE INDEX "Ticket_closedByUserId_idx" ON "Ticket"("closedByUserId");

-- CreateIndex
CREATE INDEX "Notification_recipientUserId_idx" ON "Notification"("recipientUserId");

-- CreateIndex
CREATE INDEX "Notification_ticketId_idx" ON "Notification"("ticketId");

-- CreateIndex
CREATE INDEX "Notification_readAt_idx" ON "Notification"("readAt");

-- AddForeignKey
ALTER TABLE "Department"
ADD CONSTRAINT "Department_managerUserId_fkey"
FOREIGN KEY ("managerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User"
ADD CONSTRAINT "User_departmentId_fkey"
FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket"
ADD CONSTRAINT "Ticket_createdByUserId_fkey"
FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket"
ADD CONSTRAINT "Ticket_originDepartmentId_fkey"
FOREIGN KEY ("originDepartmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket"
ADD CONSTRAINT "Ticket_targetDepartmentId_fkey"
FOREIGN KEY ("targetDepartmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket"
ADD CONSTRAINT "Ticket_assignedToUserId_fkey"
FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket"
ADD CONSTRAINT "Ticket_closedByUserId_fkey"
FOREIGN KEY ("closedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_recipientUserId_fkey"
FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_ticketId_fkey"
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
