import {
  calculateSectionResult,
  calculateTotalResult,
} from "@/app/lib/corrections/marks";
import {
  CorrectionData,
  Section,
  Student,
} from "../../../../../types/CorrectionTypes";

const separator =
  "================================================================";

const NOTE_FINALE = "Note finale";

export function generateMailBody(
  correctionData: CorrectionData,
  example: boolean
): string {
  let str = `${separator}\n\n`;
  str += "Étudiants : \n";

  // Use forEach instead of map since you're building a string
  correctionData.students.forEach((student: Student) => {
    str += `${example ? "Nom Prénom" : student.name}, `;
  });

  str += "\n\n";

  // Same here, use forEach instead of map
  correctionData.sections.forEach((section: Section) => {
    str += `- ${section.name} : ${
      example ? "X" : calculateSectionResult(section)
    }\n`;
  });

  str += `\nNote finale : ${
    example ? "X" : calculateTotalResult(correctionData.sections)
  }`;

  str += `\n\nRemarques : \n${
    example
      ? "Ensemble des remarques sur le travail."
      : correctionData.appreciation
  }`;

  str += `\n\n${separator}`;
  return str;
}
