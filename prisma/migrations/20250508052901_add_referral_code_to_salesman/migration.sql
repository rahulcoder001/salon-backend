/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Salesman` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Salesman" ADD COLUMN     "referralCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Salesman_referralCode_key" ON "Salesman"("referralCode");
