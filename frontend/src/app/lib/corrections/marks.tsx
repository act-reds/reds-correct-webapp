import { CorrectionData, Section } from "../../../../types/CorrectionTypes";

  // Calculate section result
  export const calculateSectionResult = (section: Section) => {
    const total = section.subsections.reduce((sum, subsection) => {
      const inputValue = subsection.result || 0;
      return sum + inputValue * subsection.weight;
    }, 0);
    const divVal = section.subsections.reduce((div, subsection) => {
      return div + subsection.weight;
    }, 0);
    const result = (total / divVal) * section.weight * 5;
    return parseFloat(result.toFixed(2));
  };

  // Calculate total result across all sections and add 1
  export const calculateTotalResult = (sections: Section[]) => {
    const totalResult = sections.reduce((sum, section) => {
      return sum + calculateSectionResult(section);
    }, 0);
    return (totalResult + 1).toFixed(2);
  };

// Calculate average class grade
export const calculateAverageClassGrade = (correctionData: CorrectionData[]) => {
    // Edge case: if no data, return 0
    if (correctionData.length === 0) return 0;
  
    // Calculate the sum of all total grades
    const totalGradesSum = correctionData.reduce((sum, correction) => {
      const totalGrade = parseFloat(calculateTotalResult(correction.sections)); // Calculate total grade for each correction
      return sum + totalGrade;
    }, 0);
  
    // Calculate the average by dividing the sum by the number of students (correctionData length)
    const averageGrade = totalGradesSum / correctionData.length;
  
    // Return the average, rounded to 2 decimal places
    return averageGrade.toFixed(2);
  };