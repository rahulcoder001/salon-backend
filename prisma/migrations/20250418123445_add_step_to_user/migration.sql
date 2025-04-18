/*
  Warnings:

  - You are about to drop the column `branch_id` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_branch_id_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "branch_id";
