import { calculateSectionResult, calculateTotalResult } from "@/app/lib/corrections/marks";
import { CorrectionData, Section, Student } from "../../../../../types/CorrectionTypes";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Function to sanitize filenames
const sanitizeFilename = (filename: string) => {
  return filename.replace(/[^a-zA-Z0-9-_\.]/g, "_");
};

export async function generateFolderWithCorrections(
  correctionData: CorrectionData[],
  params: any
) {
  let returnValue = [];

  // Set pdfMake fonts
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  // Define styles for the PDF
  const styles = {
    header: {
      fontSize: 22,
      bold: true,
      alignment: "center",
      color: "#2c3e50",
      marginBottom: 10,
    },
    subheader: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        color: "#2c3e50",
        marginBottom: 10,
      },
    elementTitle: {
      fontSize: 14,
      bold: true,
      alignment: "left",
      color: "#34495e",
      marginBottom: 4,
    },
    studentName: {
      fontSize: 14,
      margin: [0, 5, 0, 5],
      bold: true,
      color: "#34495e",
    },
    studentContainer: {
      margin: [0, 5, 0, 5],
      decoration: "underline",
      alignment: "center",
      fillColor: "#f2f2f2",
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: "#000000",
      alignment: "center",
    },
    tableBody: {
      fontSize: 12,
      color: "#34495e",
      alignment: "left",
    },
    bannerText: {
      fontSize: 15,
      bold: true,
      color: "#ffffff",
      alignment: "center",
      margin: [0, 10, 0, 10],
      fillColor: "#7f8c8d", // Gray background
    },
    appreciation: {
      fontSize: 14,
      italics: true,
      margin: [0, 10, 0, 0],
      alignment: "left",
    },
    footer: {
      fontSize: 10,
      italics: true,
      alignment: "center",
      margin: [0, 10, 0, 0],
    },
  };

  for (const correction of correctionData) {
    // Generate the PDF content
    const studentNamesContent = correction.students.map((student) => ({
      text: student.name,
      style: "studentName",
      margin: [0, 5], // Margin for each name
    }));

    // Generate table rows for sections
    const sectionTableBody = [
      [
        { text: "Section Name", style: "tableHeader" },
        { text: "Weight", style: "tableHeader" },
        { text: "Result", style: "tableHeader" },
      ],
      ...correction.sections.map((section: Section) => [
        { text: section.name, style: "tableBody" },
        { text: section.weight.toString(), style: "tableBody" },
        { text: calculateSectionResult(section), style: "tableBody" }, // Sum of all subsection results
      ]),
    ];

    // Calculate total result (mark)
    const totalResult = calculateTotalResult(correction.sections);

    const docDefinition = {
      content: [
        {
          text: `${params.courseName} ${params.year} - ${params.className}`,
          style: "header",
        },
        {
          text: `${params.labName}`,
          style: "subheader",
        },
        { text: " " }, // Add space
        {
          stack: studentNamesContent, // Use stack layout to display names vertically
          style: "studentContainer",
          pageBreak: "after", // This ensures the lab/class name is on the first page with a page break after
        },
        { text: "Détail de la correction", style: "elementTitle" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto"],
            body: sectionTableBody, // Add the generated table rows here
          },
          layout: "lightHorizontalLines",
        },
        { text: " " }, // Add space
        // Banner for the total mark using a table to handle background color
        {
          table: {
            widths: ["*"],
            body: [
              [
        {
          text: `Note finale : ${totalResult}`,
                  style: "bannerText",
                  fillColor: "#34495e", // Gray background for the banner
                },
              ],
            ],
          },
          layout: "noBorders",
        },
        { text: " " }, // Add space
        {
          text: `Remarques :`,
          style: "elementTitle",
        },
        {
          text: correction.appreciation || "No remarks provided.",
          style: "appreciation", // Display assistant's remarks
        },
      ],
      styles: styles,
      footer: (currentPage: number, pageCount: number) => {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          style: "footer",
        };
      },
    };

    // Generate PDF and add to zip
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    const pdfBlob = await new Promise<Blob>((resolve) => {
      pdfDocGenerator.getBlob((blob) => resolve(blob));
    });

    let studentsName = correction.students
      .map((student: Student) => student.name)
      .join("-");

    const sanitizedFilename: string = sanitizeFilename(
      `${studentsName}-report.pdf`
    );
    returnValue.push({ pdfBlob: pdfBlob, sanitizedFilename: sanitizedFilename });
  }

  return returnValue;
}
