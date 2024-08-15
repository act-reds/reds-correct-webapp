"use client";

import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { SubSection } from "./types";

interface SubSectionFormProps {
  subSection: SubSection;
  onChange: (field: keyof SubSection, value: string | number) => void;
  onRemove: (id: string) => void;
}

const SubSectionForm: React.FC<SubSectionFormProps> = ({
  subSection,
  onChange,
  onRemove,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("name", e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange("weight", isNaN(value) ? 0 : Math.max(0, Math.min(100, value)));
  };

  const handleCriterionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("criterion", e.target.value);
  };

  return (
    <div
      className="border p-3 mb-3 rounded"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="mb-2">
        <Col md={4}>
          <Form.Group controlId={`subsection-name-${subSection.id}`}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subsection name"
              value={subSection.name}
              onChange={handleNameChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId={`subsection-weight-${subSection.id}`}>
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter subsection weight"
              value={subSection.weight}
              min={0}
              max={100}
              step={1}
              onChange={handleWeightChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId={`subsection-criterion-${subSection.id}`}>
            <Form.Label>Criterion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter criterion"
              value={subSection.criterion}
              onChange={handleCriterionChange}
            />
          </Form.Group>
        </Col>
        <Col md={1}>
          <Button variant="" onClick={() => onRemove(subSection.id)}>
            X
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SubSectionForm;
