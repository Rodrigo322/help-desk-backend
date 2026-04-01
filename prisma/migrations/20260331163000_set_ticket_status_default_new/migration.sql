-- Use NEW only after enum value has been committed in previous migration
ALTER TABLE "Ticket"
ALTER COLUMN "status" SET DEFAULT 'NEW';
