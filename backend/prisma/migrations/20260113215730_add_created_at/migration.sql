-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BillPayment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Bill_createdAt_idx" ON "Bill"("createdAt");

-- CreateIndex
CREATE INDEX "BillPayment_createdAt_idx" ON "BillPayment"("createdAt");

-- CreateIndex
CREATE INDEX "Card_createdAt_idx" ON "Card"("createdAt");

-- CreateIndex
CREATE INDEX "Family_createdAt_idx" ON "Family"("createdAt");

-- CreateIndex
CREATE INDEX "Person_createdAt_idx" ON "Person"("createdAt");
