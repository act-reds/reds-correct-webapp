-- CreateTable
CREATE TABLE "Correction" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Correction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubsectionMark" (
    "id" SERIAL NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,
    "correctionId" INTEGER NOT NULL,

    CONSTRAINT "SubsectionMark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubsectionMark" ADD CONSTRAINT "SubsectionMark_correctionId_fkey" FOREIGN KEY ("correctionId") REFERENCES "Correction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
