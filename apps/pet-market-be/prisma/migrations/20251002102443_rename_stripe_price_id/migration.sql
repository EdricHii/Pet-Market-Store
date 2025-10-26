/*
  Warnings:

  - You are about to drop the column `stripePriceID` on the `Product` table. All the data in the column will be lost.
  - Added the required column `stripePriceId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "stripePriceID",
ADD COLUMN     "stripePriceId" TEXT NOT NULL;
