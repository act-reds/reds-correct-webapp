/*
  Warnings:

  - A unique constraint covering the columns `[mail]` on the table `Assistant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assistant_mail_key" ON "Assistant"("mail");
