-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activePlanId" TEXT,
ADD COLUMN     "salesmanId" TEXT;

-- CreateTable
CREATE TABLE "Salesman" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Salesman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Salesman_email_key" ON "Salesman"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Salesman_contact_key" ON "Salesman"("contact");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_salesmanId_fkey" FOREIGN KEY ("salesmanId") REFERENCES "Salesman"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activePlanId_fkey" FOREIGN KEY ("activePlanId") REFERENCES "SubscriptionPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
