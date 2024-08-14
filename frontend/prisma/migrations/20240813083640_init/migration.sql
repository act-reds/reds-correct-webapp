/*
  Warnings:

  - You are about to drop the column `surname` on the `Student` table. All the data in the column will be lost.
  - Added the required column `formation` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "surname",
ADD COLUMN     "formation" TEXT NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL;
