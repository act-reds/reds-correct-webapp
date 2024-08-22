import React, { useState, useEffect } from "react";
import { Table, Container, Form } from "react-bootstrap";
import {
  CorrectionData,
  Section,
  SubsectionMark,
  SectionInfo,
  SubsectionInfo,
} from "../../../types/CorrectionTypes";

interface SectionTableWithInputProps {
  labId: number;
  sections: Section[];
  activeId: number;
  correctionData: CorrectionData[];
  setCorrectionData: React.Dispatch<React.SetStateAction<CorrectionData[]>>;
}

const SectionTableWithInput: React.FC<SectionTableWithInputProps> = ({
  labId,
  sections,
  correctionData,
  activeId,
  setCorrectionData,
}) => {
  const [inputValues, setInputValues] = useState<number[]>([]);

  const handleInputChange = (subsectionId: number, value: number) => {
    console.log(`subsectionId: ${subsectionId} -- value: ${value}`);
    // let numericValue = parseFloat(value);

    // if (isNaN(numericValue) || numericValue < 0) {
    //   numericValue = 0;
    // } else if (numericValue > 1) {
    //   numericValue = 1;
    // }
  };

  // Calculate section result
  const calculateSectionResult = (section: Section) => {
    const total = section.subsections.reduce((sum, subsection) => {
      const inputValue = inputValues[subsection.id] || 0;
      return sum + inputValue * subsection.weight;
    }, 0);
    const divVal = section.subsections.reduce((div, subsection) => {
      return div + subsection.weight;
    }, 0);
    const result = (total / divVal) * section.weight * 5;
    return parseFloat(result.toFixed(2));
  };

  // Calculate total result across all sections and add 1
  const calculateTotalResult = () => {
    const totalResult = sections.reduce((sum, section) => {
      return sum + calculateSectionResult(section);
    }, 0);
    return (totalResult + 1).toFixed(2);
  };

  console.log("Sections", sections);

  return (
    <Container fluid className="mt-3">
      {sections.map((section) => (
        <div key={section.id}>
          <Table striped bordered hover className="mb-3">
            <thead>
              <tr>
                <th colSpan={3}>{section.name}</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {sections && section.subsections.length > 0 ? (
                section.subsections.map((subsection) => (
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
                        value={inputValues[subsection.id] || 0}
                        onChange={(e) =>
                          handleInputChange(subsection.id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No subsections available.</td>
                </tr>
              )}
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
            <th className="text-end fw-bold">{calculateTotalResult()}</th>
          </tr>
        </thead>
      </Table>
    </Container>
  );
};

export default SectionTableWithInput;
