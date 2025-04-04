/*
  Warnings:

  - You are about to drop the column `salon_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_salon_id_fkey";

-- DropIndex
DROP INDEX "User_contact_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "salon_id",
ADD COLUMN     "salonId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
