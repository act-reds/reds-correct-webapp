// components/GridAccordion.tsx
"use client";
import React, { useState } from "react";
import { Accordion, Spinner } from "react-bootstrap";
import { getGridSections } from "@/app/lib/data/lab";
import SectionTable from "./SectionTable";

interface GridAccordionProps {
  grids: any[];
  filteredGrids: any[];
}

const GridAccordion: React.FC<GridAccordionProps> = ({
  grids,
  filteredGrids,
}) => {
  const [sections, setSections] = useState<{ [key: number]: any[] }>({});
  const [loadingSections, setLoadingSections] = useState<{
    [key: number]: boolean;
  }>({});

  const handleAccordionSelect = async (
    eventKey: string | null,
    gridId: number
  ) => {
    if (sections[gridId]) return;

    setLoadingSections((prev) => ({ ...prev, [gridId]: true }));

    const fetchedSections = await getGridSections(gridId);
    setSections((prev) => ({ ...prev, [gridId]: fetchedSections }));
    setLoadingSections((prev) => ({ ...prev, [gridId]: false }));
  };

  return (
    <Accordion>
      {filteredGrids.map((grid, index) => (
        <Accordion.Item
          eventKey={index.toString()}
          key={grid.id}
          onClick={() => handleAccordionSelect(index.toString(), grid.id)}
        >
          <Accordion.Header>{grid.name}</Accordion.Header>
          <Accordion.Body>
            {loadingSections[grid.id] ? (
              <Spinner animation="border" />
            ) : sections[grid.id] ? (
              sections[grid.id].length > 0 ? (
                <SectionTable sections={sections[grid.id]} />
              ) : (
                <p>No sections found.</p>
              )
            ) : (
              <p>Click to load sections.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default GridAccordion;
