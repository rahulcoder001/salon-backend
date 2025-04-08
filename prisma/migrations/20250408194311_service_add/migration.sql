-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "service_price" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "branch_id" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
