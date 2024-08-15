"use client";

import React from "react";
import SectionForm from "./SectionForm";

interface Section {
  id: string;
  name: string;
  weight: number;
}

interface SectionListProps {
  sections: Section[];
  onSectionChange: (
    id: string,
    field: keyof Section,
    value: string | number
  ) => void;
  onSectionRemove: (id: string) => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  onSectionChange,
  onSectionRemove,
}) => {
  return (
    <>
      {sections.map((section) => (
        <SectionForm
          key={section.id}
          section={section}
          onChange={onSectionChange}
          onRemove={onSectionRemove}
        />
      ))}
    </>
  );
};

export default SectionList;
