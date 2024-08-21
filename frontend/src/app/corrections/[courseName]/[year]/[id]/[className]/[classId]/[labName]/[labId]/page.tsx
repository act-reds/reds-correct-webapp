"use client";

import { getLabData } from "@/app/lib/data/lab";
import CorrectionsAccordion from "@/components/Corrections/LabCorrections/CorrectionsAccordion";
import GridSelectionAccordion from "@/components/Corrections/LabCorrections/GridSelectionAccordion";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

const LabCorrectionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const labId = parseInt(params.labId, 10);
  const labName = params.labName;
  const courseName = params.courseName;

  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    "0"
  );
  const [labData, setLabData] = useState<any | null>(null);

  const fetchLabData = async () => {
    try {
      const data = await getLabData(labId);
      setLabData(data);

      // If the lab has a grid attached, set the accordion key to "1"
      if (data.grid) {
        setActiveAccordionKey("1");
      }
    } catch (error) {
      console.error("Error fetching lab data:", error);
    }
  };

  useEffect(() => {
    fetchLabData();
  }, [labId]);

  const handleAccordionClick = (eventKey: string | null) => {
    setActiveAccordionKey(eventKey);
  };

  const handleGridUpdated = () => {
    fetchLabData(); // Re-fetch lab data after grid is updated
  };

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        {/* Always render the first accordion item for grid selection */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Grid selection</Accordion.Header>
          <Accordion.Body>
            <GridSelectionAccordion
              labId={labId}
              courseName={courseName}
              labName={labName}
              setActiveAccordionKey={setActiveAccordionKey}
              onGridUpdated={handleGridUpdated} // Pass the callback function
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* Conditionally render the second accordion item only if the lab has a grid */}
        {labData && labData.grid && (
          <Accordion.Item eventKey="1">
            <Accordion.Header>Corrections</Accordion.Header>
            <Accordion.Body>
              <CorrectionsAccordion labId={labId} />
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  );
};

export default LabCorrectionPage;
