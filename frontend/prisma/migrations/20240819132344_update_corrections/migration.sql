/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Correction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correctionId,subsectionId]` on the table `SubsectionMark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `labId` to the `Correction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subsectionId` to the `SubsectionMark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Correction" ADD COLUMN     "labId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubsectionMark" ADD COLUMN     "subsectionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CorrectionStudent" (
    "correctionId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "CorrectionStudent_pkey" PRIMARY KEY ("correctionId","studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Correction_id_key" ON "Correction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SubsectionMark_correctionId_subsectionId_key" ON "SubsectionMark"("correctionId", "subsectionId");

-- AddForeignKey
ALTER TABLE "CorrectionStudent" ADD CONSTRAINT "CorrectionStudent_correctionId_fkey" FOREIGN KEY ("correctionId") REFERENCES "Correction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectionStudent" ADD CONSTRAINT "CorrectionStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Correction" ADD CONSTRAINT "Correction_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubsectionMark" ADD CONSTRAINT "SubsectionMark_subsectionId_fkey" FOREIGN KEY ("subsectionId") REFERENCES "SubSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
