/*
  Warnings:

  - You are about to drop the column `password` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `profile_img` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contact]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contact]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Made the column `contact` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `branch_id` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staff_id` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_user_id_fkey";

-- DropIndex
DROP INDEX "Client_email_key";

-- DropIndex
DROP INDEX "Staff_user_id_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "password",
DROP COLUMN "profile_img",
DROP COLUMN "user_id",
ADD COLUMN     "branch_id" INTEGER NOT NULL,
ALTER COLUMN "contact" SET NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "branch_id" INTEGER NOT NULL,
ADD COLUMN     "staff_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salon_id" INTEGER;

-- CreateTable
CREATE TABLE "Salon" (
    "id" SERIAL NOT NULL,
    "salon_name" TEXT NOT NULL,
    "salon_tag" TEXT NOT NULL,
    "opening_time" TEXT,
    "contact_email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "branch_url" TEXT,
    "salon_img_url" TEXT,

    CONSTRAINT "Salon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_location" TEXT NOT NULL,
    "salon_id" INTEGER NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_contact_key" ON "Staff"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staff_id_key" ON "Staff"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_key" ON "User"("contact");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_salon_id_fkey" FOREIGN KEY ("salon_id") REFERENCES "Salon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_salon_id_fkey" FOREIGN KEY ("salon_id") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
