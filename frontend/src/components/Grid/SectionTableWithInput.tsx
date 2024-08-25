import React, { useState, useEffect } from "react";
import { Table, Container, Form } from "react-bootstrap";
import {
  CorrectionData,
  Section,
  SubsectionMark,
  SectionInfo,
  SubsectionInfo,
} from "../../../types/CorrectionTypes";
import { calculateSectionResult, calculateTotalResult } from "@/app/lib/corrections/marks";

interface SectionTableWithInputProps {
  labId: number;
  correction: CorrectionData;
  activeId: number;
  correctionData: CorrectionData[];
  setCorrectionData: React.Dispatch<React.SetStateAction<CorrectionData[]>>;
}

const SectionTableWithInput: React.FC<SectionTableWithInputProps> = ({
  labId,
  correction,
  correctionData,
  activeId,
  setCorrectionData,
}) => {
  const handleInputChange = (subsectionId: number, value: string) => {
    let numericValue = parseFloat(value);
    // Ensure the value is clamped between 0 and 1
  if (isNaN(numericValue)) {
    numericValue = 0;
  } else if (numericValue < 0) {
    numericValue = 0;
  } else if (numericValue > 1) {
    numericValue = 1;
  }
    // Update the correctionData state by finding the specific subsection
    setCorrectionData((prevData) =>
      prevData.map((data) => {
        if (data.itemId === activeId) {
          return {
            ...data,
            sections: data.sections.map((section) => ({
              ...section,
              subsections: section.subsections.map((subsection) =>
                subsection.id === subsectionId
                  ? { ...subsection, result: numericValue }
                  : subsection
              ),
            })),
          };
        }
        return data;
      })
    );
  };


  return (
    <Container fluid className="mt-3">
      {correction.sections.map((section) => (
        <div key={section.id}>
          <Table striped bordered hover className="mb-3">
            <thead>
              <tr>
                <th colSpan={3}>{section.name}</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {section.subsections.map((subsection) => (
                <tr key={subsection.id}>
                  <td style={{ width: "45%" }}>{subsection.name}</td>
                  <td style={{ width: "30%" }}>{subsection.criterion}</td>
                  <td style={{ width: "10%" }} className="text-end">
                    {subsection.weight}
                  </td>
                  <td style={{ width: "15%" }}>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={subsection.result || 0}
                      onChange={(e) =>
                        handleInputChange(subsection.id, e.target.value)
                      }
                      onFocus={(e) => e.target.select()} // This will select all text on focus
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-end fw-bold">
                  {section.weight}
                </td>
                <td className="text-end fw-bold">
                  {calculateSectionResult(section)}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ))}

      {/* Final result row */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th colSpan={4}>Result</th>
            <th className="text-end fw-bold">{calculateTotalResult(correctionData[activeId].sections)}</th>
          </tr>
        </thead>
      </Table>
    </Container>
  );
};

export default SectionTableWithInput;
