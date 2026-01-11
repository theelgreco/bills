-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastFourDigits" INTEGER NOT NULL,
    "sortCode" INTEGER NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalAmountPence" INTEGER NOT NULL,
    "paymentDay" INTEGER NOT NULL,
    "transferDay" INTEGER NOT NULL,
    "cardId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillPayment" (
    "id" TEXT NOT NULL,
    "amountPence" INTEGER NOT NULL,
    "billId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,

    CONSTRAINT "BillPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_username_key" ON "Person"("username");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillPayment" ADD CONSTRAINT "BillPayment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
