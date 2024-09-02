import { calculateTotalResult } from "@/app/lib/corrections/marks";
import { CorrectionData, Student } from "../../../../../types/CorrectionTypes";
import * as XLSX from "xlsx"; // Import xlsx

export function generateXlsxMarks(
  correctionData: CorrectionData[],
  classStudents: Student[]
) {
  // Initialize an empty array to hold the data for the Excel file
  let data: any[] = [];

  function pushStudent(student: Student, mark: number) {
    data.push([
        student.name,
        student.mail,
        student.mode,
        student.formation,
        mark,
      ]);
  }

  // Create a set to track students who have corrections
  const studentsWithCorrections = new Set<number>();

  correctionData.forEach((correction: CorrectionData) => {
    correction.students.forEach((student: Student) => {
      // Mark the student as having a correction
      studentsWithCorrections.add(student.id);

      // Push the student's name and total result into the data array
      pushStudent(student, Number(calculateTotalResult(correction.sections)))
    });
  });

  // Add students who do not have any corrections
  classStudents.forEach((student: Student) => {
    if (!studentsWithCorrections.has(student.id)) {
      // Add the student with a default mark of 1
      pushStudent(student, 1);
    }
  });

  data.sort((a, b) => a[0].localeCompare(b[0]));
  data = [["Nom", "Email", "Mode", "Formation", "Note"], ...data];

  return data;
}
