"use client";

import React from "react";
import { Button, Container } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import SectionList from "./SectionList";

interface Section {
  id: string;
  name: string;
  weight: number;
}

const GridCreatePage: React.FC = () => {
  const [sections, setSections] = React.useState<Section[]>([]);

  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: uuidv4(), name: "", weight: 0 },
    ]);
  };

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

  const handleSectionRemove = (id: string) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  return (
    <Container>
      <h1>Create Grid</h1>
      <Button variant="primary" onClick={addSection} className="mb-3">
        +
      </Button>
      <SectionList
        sections={sections}
        onSectionChange={handleSectionChange}
        onSectionRemove={handleSectionRemove}
      />
    </Container>
  );
};

export default GridCreatePage;
