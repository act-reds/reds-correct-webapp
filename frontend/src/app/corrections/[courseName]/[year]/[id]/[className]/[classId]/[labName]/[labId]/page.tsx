"use client";

import { getLabData } from "@/app/lib/data/lab";
import CorrectionsAccordion from "@/components/Corrections/LabCorrections/CorrectionsAccordion";
import GridSelectionAccordion from "@/components/Corrections/LabCorrections/GridSelectionAccordion";
import SendFeedbackToStudent from "@/components/Corrections/LabCorrections/SendFeedbackToStudents";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import { CorrectionData } from "../../../../../../../../../../types/CorrectionTypes";
import { getCorrectionDataFromLab } from "@/app/lib/data/correction";

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
  const [correctionData, setCorrectionData] = useState<CorrectionData[]>([]);

  const fetchLabData = async () => {
    try {
      const data = await getLabData(labId);
      setLabData(data);
      console.log("data", data);
      if (data.grid) {
        setActiveAccordionKey("1");
      }

      if (data.readyToSend) {
        setActiveAccordionKey("2");
      }
    } catch (error) {
      console.error("Error fetching lab data:", error);
    }
  };

  useEffect(() => {
    const asyncGetCorrectionData = async () => {
      const tmpCorrectionData = await getCorrectionDataFromLab(labId);
      console.log("TMPPPPP", tmpCorrectionData);
      setCorrectionData(tmpCorrectionData);
    };

    fetchLabData();
    asyncGetCorrectionData();
  }, [labId]);

  const handleAccordionClick = (eventKey: string | null) => {
    setActiveAccordionKey(eventKey);
  };

  const handleGridUpdated = () => {
    fetchLabData(); // Re-fetch lab data after grid is updated
  };

  const handleFinishCorrectionClick = async () => {
    try {
      const response = await fetch(
        `/api/data/lab/${labId}/update-lab-ready-to-send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ labId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result.message);
        // Optionally handle any UI updates or redirects
      } else {
        console.error("Error:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Grid selection</Accordion.Header>
          <Accordion.Body>
            <GridSelectionAccordion
              labId={labId}
              courseName={courseName}
              labName={labName}
              setActiveAccordionKey={setActiveAccordionKey}
              onGridUpdated={handleGridUpdated}
            />
          </Accordion.Body>
        </Accordion.Item>

        {labData && labData.grid && (
          <Accordion.Item eventKey="1">
            <Accordion.Header>Corrections</Accordion.Header>
            <Accordion.Body>
              <CorrectionsAccordion labId={labId} />
              <div className="d-flex justify-content-center my-3">
                <Button onClick={handleFinishCorrectionClick} variant="success">
                  Finish
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {labData && labData.readyToSend && (
          <Accordion.Item eventKey="2">
            <Accordion.Header>Send feedback</Accordion.Header>
            <Accordion.Body>
              <SendFeedbackToStudent
                correctionData={correctionData}
                labData={labData}
              ></SendFeedbackToStudent>
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  );
};

export default LabCorrectionPage;
