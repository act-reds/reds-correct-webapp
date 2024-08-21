import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import DynamicRectangles from "./DynamicRectangle"; // Adjust import based on your file structure

interface CorrectionsAccordionProps {
  labId: number;
}

const CorrectionsAccordion: React.FC<CorrectionsAccordionProps> = ({
  labId,
}) => {
  return (
    <div>
      <h3>Dynamic Rectangles Example</h3>
      <DynamicRectangles labId={labId} />
      {/* Other content goes here */}
    </div>
  );
};

export default CorrectionsAccordion;
