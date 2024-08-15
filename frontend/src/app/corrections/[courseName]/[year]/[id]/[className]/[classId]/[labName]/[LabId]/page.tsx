"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";

const LabCorrectionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    "0"
  );
  const handleAccordionClick = (eventKey: string | null) => {
    setActiveAccordionKey(eventKey);
  };

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Grid selection</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Add lab</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formLabName">
                <Form.Text className="text-muted">
                  e.g.: Lab01, lab02, lab3...
                </Form.Text>
                <Form.Group className="mt-3"></Form.Group>
              </Form.Group>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default LabCorrectionPage;
