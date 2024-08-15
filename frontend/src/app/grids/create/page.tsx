"use client";

import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

interface Section {
  id: string;
  name: string;
  weight: number;
}

const GridCreatePage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);

  // Function to add a new section
  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: uuidv4(), name: "", weight: 0 },
    ]);
  };

  // Function to handle changes in section name
  const handleNameChange = (id: string, value: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, name: value } : section
      )
    );
  };

  // Function to handle changes in section weight
  const handleWeightChange = (id: string, value: string) => {
    let newValue = Number(value);

    // Ensure weight is between 0 and 1, with step of 0.05
    if (isNaN(newValue)) newValue = 0;
    if (newValue < 0) newValue = 0;
    if (newValue > 1) newValue = 1;
    if (newValue % 0.05 !== 0) newValue = Math.round(newValue / 0.05) * 0.05;

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, weight: newValue } : section
      )
    );
  };

  // Function to handle removing a section
  const removeSection = (id: string) => {
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
      {sections.map((section) => (
        <div key={section.id} className="border p-3 mb-3 rounded">
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group controlId={`section-name-${section.id}`}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter section name"
                  value={section.name}
                  onChange={(e) => handleNameChange(section.id, e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId={`section-weight-${section.id}`}>
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter section weight"
                  value={section.weight}
                  onChange={(e) =>
                    handleWeightChange(section.id, e.target.value)
                  }
                  min={0}
                  max={1}
                  step={0.05}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="danger"
                onClick={() => removeSection(section.id)}
                className="btn-sm"
              >
                X
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default GridCreatePage;
