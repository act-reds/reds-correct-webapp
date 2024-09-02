import { Button, Col, Form, Row } from "react-bootstrap";
import * as XLSX from "xlsx"; // Import xlsx
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useParams } from "next/navigation";
import { generateXlsxMarks } from "@/app/code/utils/corrections/generateXlsxMarks";
import {
  Correction,
  CorrectionData,
  Student,
} from "../../../../types/CorrectionTypes";
import { generateFolderWithCorrections } from "@/app/code/utils/corrections/generateFolderWithCorrections";

pdfMake.vfs = pdfFonts.pdfMake.vfs; // Add fonts to pdfMake

interface GenerateFilesProps {
  correctionData: CorrectionData[];
}

const GenerateFiles: React.FC<GenerateFilesProps> = ({ correctionData }) => {
  const params = useParams();

  // Function to generate and download the Excel file
  const handleGenerateXlsx = async () => {
    try {
      const response = await fetch(
        `/api/data/class/${params.classId as string}/get-students`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      const students: Student[] = await response.json();
      const dataForXlsx = generateXlsxMarks(correctionData, students);
      const worksheet = XLSX.utils.aoa_to_sheet(dataForXlsx);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      const filename = `${params.courseName}-${params.year}-${params.className}-${params.labName}-marks.xlsx`;
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error generating XLSX file:", error);
      alert("Failed to create Xlsx file...");
    }
  };

  // Function to generate PDFs and download as a ZIP file
  const handleGeneratePdfZip = async () => {
    try {
      const response = await fetch(
        `/api/data/class/${params.classId as string}/get-students`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      const students: Student[] = await response.json();

      // Initialize JSZip instance
      const zip = new JSZip();

      const pdfFiles = await generateFolderWithCorrections(
        correctionData,
        params
      );
      pdfFiles.forEach((file) => {
        zip.file(file.sanitizedFilename, file.pdfBlob);
      });

      // Generate a nd download the ZIP file
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "corrections-reports.zip");
      });
    } catch (error) {
      console.error("Error generating PDF ZIP file:", error);
      alert("Failed to create PDF ZIP file...");
    }
  };

  return (
    <>
      {/* First Row: Label and Button */}
      <Row className="align-items-center mb-3">
        <Col md={10}>
          <Form.Label>
            Generate and download a xslx file with the marks
          </Form.Label>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleGenerateXlsx}>
            Download
          </Button>
        </Col>
      </Row>

      {/* Second Row: Label and Button */}
      <Row className="align-items-center">
        <Col md={8}>
          <Form.Label>
            Generate and download a folder with all the corrections
          </Form.Label>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleGeneratePdfZip}>
            Download
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default GenerateFiles;
