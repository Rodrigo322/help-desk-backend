-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'NEW';
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'PENDING';
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'ON_HOLD';
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'RESOLVED';

-- CreateEnum
CREATE TYPE "NotificationEventType" AS ENUM ('CREATED', 'ASSIGNED', 'UPDATED');

-- CreateEnum
CREATE TYPE "TicketAuditLogAction" AS ENUM ('STATUS_CHANGED', 'ASSIGNED', 'PRIORITY_CHANGED');

-- AlterTable
ALTER TABLE "Comment"
ADD COLUMN "isInternal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket"
ADD COLUMN "firstResponseAt" TIMESTAMP(3),
ADD COLUMN "resolvedAt" TIMESTAMP(3),
ADD COLUMN "firstResponseDeadlineAt" TIMESTAMP(3),
ADD COLUMN "resolutionDeadlineAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Notification"
ADD COLUMN "eventType" "NotificationEventType" NOT NULL DEFAULT 'UPDATED';

ALTER TABLE "Notification" ALTER COLUMN "eventType" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TicketAuditLog" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" "TicketAuditLogAction" NOT NULL,
    "fromValue" TEXT,
    "toValue" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_isInternal_idx" ON "Comment"("isInternal");
CREATE INDEX "Ticket_firstResponseDeadlineAt_idx" ON "Ticket"("firstResponseDeadlineAt");
CREATE INDEX "Ticket_resolutionDeadlineAt_idx" ON "Ticket"("resolutionDeadlineAt");
CREATE INDEX "Notification_eventType_idx" ON "Notification"("eventType");
CREATE INDEX "TicketAuditLog_ticketId_idx" ON "TicketAuditLog"("ticketId");
CREATE INDEX "TicketAuditLog_actorUserId_idx" ON "TicketAuditLog"("actorUserId");
CREATE INDEX "TicketAuditLog_action_idx" ON "TicketAuditLog"("action");

-- AddForeignKey
ALTER TABLE "TicketAuditLog"
ADD CONSTRAINT "TicketAuditLog_ticketId_fkey"
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TicketAuditLog"
ADD CONSTRAINT "TicketAuditLog_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
