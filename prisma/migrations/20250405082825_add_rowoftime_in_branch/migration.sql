/*
  Warnings:

  - Added the required column `closeings_time` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_email` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_number` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opning_time` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "closeings_time" TEXT NOT NULL,
ADD COLUMN     "contact_email" TEXT NOT NULL,
ADD COLUMN     "contact_number" TEXT NOT NULL,
ADD COLUMN     "opning_time" TEXT NOT NULL;
