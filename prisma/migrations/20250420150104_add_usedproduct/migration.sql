-- CreateTable
CREATE TABLE "UsedProduct" (
    "id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "staff_id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsedProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsedProduct" ADD CONSTRAINT "UsedProduct_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedProduct" ADD CONSTRAINT "UsedProduct_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedProduct" ADD CONSTRAINT "UsedProduct_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
