/*
  Warnings:

  - You are about to drop the column `course` on the `Grid` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Grid` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Grid` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Grid" DROP COLUMN "course",
DROP COLUMN "year";

-- CreateIndex
CREATE UNIQUE INDEX "Grid_name_key" ON "Grid"("name");
