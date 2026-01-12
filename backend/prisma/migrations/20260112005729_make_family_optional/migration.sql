-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_familyId_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "familyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
