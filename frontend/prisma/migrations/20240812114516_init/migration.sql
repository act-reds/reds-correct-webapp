/*
  Warnings:

  - You are about to drop the column `mail` on the `Assistant` table. All the data in the column will be lost.
  - You are about to drop the `_ClassAssistants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Assistant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ClassAssistants" DROP CONSTRAINT "_ClassAssistants_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassAssistants" DROP CONSTRAINT "_ClassAssistants_B_fkey";

-- DropIndex
DROP INDEX "Assistant_mail_key";

-- AlterTable
ALTER TABLE "Assistant" DROP COLUMN "mail",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ClassAssistants";

-- CreateTable
CREATE TABLE "CourseAssistant" (
    "courseId" INTEGER NOT NULL,
    "assistantId" INTEGER NOT NULL,

    CONSTRAINT "CourseAssistant_pkey" PRIMARY KEY ("courseId","assistantId")
);

-- CreateTable
CREATE TABLE "ClassAssistant" (
    "classId" INTEGER NOT NULL,
    "assistantId" INTEGER NOT NULL,

    CONSTRAINT "ClassAssistant_pkey" PRIMARY KEY ("classId","assistantId")
);

-- AddForeignKey
ALTER TABLE "CourseAssistant" ADD CONSTRAINT "CourseAssistant_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssistant" ADD CONSTRAINT "CourseAssistant_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAssistant" ADD CONSTRAINT "ClassAssistant_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAssistant" ADD CONSTRAINT "ClassAssistant_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
