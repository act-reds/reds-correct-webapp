import React from "react";
import { Table, Container } from "react-bootstrap";

interface BaseSectionTableProps {
  sections: any[];
  renderSubsectionColumns: (subsection: any, index: number) => JSX.Element;
  renderSectionColumns: (section: any) => JSX.Element;
}

const BaseSectionTable: React.FC<BaseSectionTableProps> = ({
  sections,
  renderSubsectionColumns,
  renderSectionColumns,
}) => {
  return (
    <>
      {sections && (
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
                  {section.subSections && section.subSections.length > 0 ? (
                    section.subSections.map((subsection, index) => (
                      <tr key={subsection.id}>
                        <td style={{ width: "50%" }}>
                          {subsection.subSectionName}
                        </td>
                        <td style={{ width: "40%" }}>
                          {subsection.subSectionCriterion}
                        </td>
                        <td style={{ width: "10%" }} className="text-end">
                          {subsection.subSectionWeight}
                        </td>
                        {renderSubsectionColumns(subsection, index)}
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
                    {renderSectionColumns(section)}
                  </tr>
                </tbody>
              </Table>
            </div>
          ))}
        </Container>
      )}
    </>
  );
};

export default BaseSectionTable;
