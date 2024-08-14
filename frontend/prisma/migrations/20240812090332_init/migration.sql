/*
  Warnings:

  - You are about to drop the column `name` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `Assistant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assistant" DROP COLUMN "name",
DROP COLUMN "surname";
