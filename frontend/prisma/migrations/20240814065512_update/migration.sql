/*
  Warnings:

  - You are about to drop the `_ClassStudents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClassStudents" DROP CONSTRAINT "_ClassStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassStudents" DROP CONSTRAINT "_ClassStudents_B_fkey";

-- DropTable
DROP TABLE "_ClassStudents";

-- CreateTable
CREATE TABLE "ClassStudent" (
    "classId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "ClassStudent_pkey" PRIMARY KEY ("classId","studentId")
);

-- AddForeignKey
ALTER TABLE "ClassStudent" ADD CONSTRAINT "ClassStudent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassStudent" ADD CONSTRAINT "ClassStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
