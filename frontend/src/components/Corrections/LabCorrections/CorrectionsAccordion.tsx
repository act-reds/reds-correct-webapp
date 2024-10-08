import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import DynamicRectangles from "./DynamicRectangle"; // Adjust import based on your file structure
import {
  Section,
  Student,
  CorrectionData,
  Correction,
} from "../../../../types/CorrectionTypes";
import { getCorrectionDataFromLab } from "@/app/lib/data/correction";

interface CorrectionsAccordionProps {
  labId: number;
}

const CorrectionsAccordion: React.FC<CorrectionsAccordionProps> = ({
  labId,
}) => {
  const [sections, setSections] = useState<Section[] | null>(null); // State to store sections
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors
  const [students, setStudents] = useState<Student[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]); // State to store corrections
  const [correctionData, setCorrectionData] = useState<CorrectionData[]>([]);

  useEffect(() => {
    // Fetch sections and corrections data from the API
    const fetchData = async () => {
      try {
        // Fetch sections data
        const sectionResponse = await fetch(
          `/api/data/lab/${labId}/get-correction-data`
        );
        if (!sectionResponse.ok) {
          throw new Error("Failed to fetch sections data");
        }
        const sectionData = await sectionResponse.json();
        setSections(sectionData.gridData); // Set the sections data
        setStudents(
          sectionData.classStudents.map((student: any) => ({
            id: student.id,
            name: student.name,
          }))
        );

        const correctionTmp = await getCorrectionDataFromLab(labId);
        setCorrections(correctionTmp.corrections);
        setCorrectionData(correctionTmp.corrections); // Set the mapped CorrectionData
      } catch (err) {
        setError(err.message || "An error occurred"); // Handle error
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, [labId]); // Dependency array to trigger the fetch when labId changes

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      {sections && sections.length > 0 ? (
        <DynamicRectangles
          labId={labId}
          sections={sections}
          students={students}
          corrections={corrections} // Pass corrections to the DynamicRectangles component
          correctionData={correctionData}
          setCorrectionData={setCorrectionData}
        />
      ) : (
        <Alert variant="warning">No sections found</Alert>
      )}
    </div>
  );
};

export default CorrectionsAccordion;
