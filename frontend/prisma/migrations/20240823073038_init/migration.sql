/*
  Warnings:

  - Added the required column `appreciation` to the `Correction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Correction" ADD COLUMN     "appreciation" TEXT NOT NULL;
