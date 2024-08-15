"use client";

import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import SectionForm from "./SectionForm";
import SubSectionForm from "./SubSectionForm";
import { Section, SubSection } from "./types";

const GridCreatePage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);

  // Add a new section
  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: uuidv4(), name: "", weight: 0, subsections: [] },
    ]);
  };

  // Handle section changes
  const handleSectionChange = (
    id: string,
    field: keyof Section,
    value: string | number
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  // Remove a section
  const removeSection = (id: string) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  // Add a new subsection to a section
  const addSubSection = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subsections: [
                ...section.subsections,
                {
                  id: uuidv4(),
                  name: "",
                  weight: 0,
                  criterion: "",
                },
              ],
            }
          : section
      )
    );
  };

  // Handle subsection changes
  const handleSubSectionChange = (
    sectionId: string,
    subSectionId: string,
    field: keyof SubSection,
    value: string | number
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subsections: section.subsections.map((subSection) =>
                subSection.id === subSectionId
                  ? { ...subSection, [field]: value }
                  : subSection
              ),
            }
          : section
      )
    );
  };

  // Remove a subsection
  const removeSubSection = (sectionId: string, subSectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subsections: section.subsections.filter(
                (subSection) => subSection.id !== subSectionId
              ),
            }
          : section
      )
    );
  };

  return (
    <Container>
      <Button variant="primary" onClick={addSection} className="mb-3">
        Add Section
      </Button>
      {sections.map((section) => (
        <div
          key={section.id}
          className="border p-3 mb-3 rounded"
          style={{ backgroundColor: "white" }}
        >
          <SectionForm
            section={section}
            onChange={handleSectionChange}
            onRemove={removeSection}
          />
          <Button
            variant="secondary"
            onClick={() => addSubSection(section.id)}
            className="mb-3"
          >
            Add Subsection
          </Button>
          {section.subsections.map((subSection) => (
            <SubSectionForm
              key={subSection.id}
              subSection={subSection}
              onChange={(field, value) =>
                handleSubSectionChange(section.id, subSection.id, field, value)
              }
              onRemove={(id) => removeSubSection(section.id, id)}
            />
          ))}
        </div>
      ))}
    </Container>
  );
};

export default GridCreatePage;
