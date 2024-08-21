// components/SectionTable.tsx
"use client";
import React from "react";
import { Table, Container } from "react-bootstrap";

interface SectionTableProps {
  sections: any[];
}

const SectionTable: React.FC<SectionTableProps> = ({ sections }) => {
  return (
    <Container fluid className="mt-3">
      {sections.map((section) => (
        <div key={section.id}>
          <Table striped bordered hover className="mb-3">
            <thead>
              <tr>
                <th colSpan={4}>{section.name}</th>
              </tr>
            </thead>
            <tbody>
              {section.subsections.length > 0 ? (
                section.subsections.map((subsection) => (
                  <tr key={subsection.id}>
                    <td style={{ width: "50%" }}>{subsection.name}</td>
                    <td style={{ width: "40%" }}>{subsection.criterion}</td>
                    <td style={{ width: "10%" }} className="text-end">
                      {subsection.weight}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No subsections available.</td>
                </tr>
              )}
              <tr>
                <td className="text-end fw-bold" colSpan={4}>
                  {section.weight}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ))}
    </Container>
  );
};

export default SectionTable;
