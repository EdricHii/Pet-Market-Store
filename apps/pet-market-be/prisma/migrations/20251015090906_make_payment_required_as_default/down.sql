-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';

