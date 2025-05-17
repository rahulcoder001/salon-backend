-- AlterTable
ALTER TABLE "PurchasedPlan" ADD COLUMN     "paymentDetails" TEXT,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;
