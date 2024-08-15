// components/GridCreatePage/SectionForm.tsx

import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

interface Section {
  id: string;
  name: string;
  weight: number;
}

interface SectionFormProps {
  section: Section;
  onChange: (id: string, field: keyof Section, value: string | number) => void;
  onRemove: (id: string) => void;
}

const SectionForm: React.FC<SectionFormProps> = ({
  section,
  onChange,
  onRemove,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(section.id, "name", e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onChange(
      section.id,
      "weight",
      isNaN(value) ? 0 : Math.max(0, Math.min(1, Math.round(value * 20) / 20))
    );
  };

  return (
    <div
      className="border p-3 mb-3 rounded"
      style={{ backgroundColor: "white" }}
    >
      <Row className="mb-2">
        <Col md={8}>
          <Form.Group controlId={`section-name-${section.id}`}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter section name"
              value={section.name}
              onChange={handleNameChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId={`section-weight-${section.id}`}>
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter section weight"
              value={section.weight}
              min={0}
              max={1}
              step={0.05}
              onChange={handleWeightChange}
            />
          </Form.Group>
        </Col>
        <Col md={1}>
          <Button variant="" onClick={() => onRemove(section.id)}>
            X
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SectionForm;
