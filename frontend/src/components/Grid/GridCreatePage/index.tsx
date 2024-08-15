"use client";

import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import SectionForm from "./SectionForm";
import SubSectionForm from "./SubSectionForm";
import { GridData, Section, SubSection } from "./types";
import { generateGrid } from "@/app/lib/data/grids";

const GridCreatePage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [course, setCourse] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [lab, setLab] = useState<string>("");
  const [more, setMore] = useState<string>("");

  // Add a new section
  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: uuidv4(), name: "", weight: 0, subsections: [] },
    ]);
  };

  // Handle section changes
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

  // Remove a section
  const removeSection = (id: string) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  // Add a new subsection to a section
  const addSubSection = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subsections: [
                ...section.subsections,
                {
                  id: uuidv4(),
                  name: "",
                  weight: 0,
                  criterion: "",
                },
              ],
            }
          : section
      )
    );
  };

  // Handle subsection changes
  const handleSubSectionChange = (
    sectionId: string,
    subSectionId: string,
    field: keyof SubSection,
    value: string | number
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subsections: section.subsections.map((subSection) =>
                subSection.id === subSectionId
                  ? { ...subSection, [field]: value }
                  : subSection
              ),
            }
          : section
      )
    );
  };

  // Remove a subsection
  const removeSubSection = (sectionId: string, subSectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subsections: section.subsections.filter(
                (subSection) => subSection.id !== subSectionId
              ),
            }
          : section
      )
    );
  };

  const handleCreateGrid = async (e: React.FormEvent) => {
    e.preventDefault();
    let gridName = "";

    if (course === "") {
      alert("Grid name: course field must be filled.");
      return;
    } else if (lab === "") {
      alert("Grid name: lab field must be filled.");
      return;
    } else {
      gridName = course + "-" + year.toString() + "-" + lab;
      if (more !== "") {
        gridName += "-" + more;
      }
    }
    console.log("Gridname -> ", gridName);

    if (sections.length === 0) {
      alert(
        "Can not generate a grid without sections. Add at least 1 section."
      );
      return;
    }

    const invalidSections = sections.filter(
      (section) => section.subsections.length === 0
    );

    if (invalidSections.length > 0) {
      alert(
        "Every section must have at least one subsection. Please add subsections to the following sections:\n" +
          invalidSections.map((section) => section.name).join("\n")
      );
      return;
    }

    // Check if the sum of all section weights equals 1
    const totalWeight = sections.reduce(
      (sum, section) => sum + section.weight,
      0
    );

    if (totalWeight !== 1) {
      alert(
        "The total weight of all sections must equal 1. Currently, it is " +
          totalWeight.toFixed(2) +
          "."
      );
      return;
    }

    const result = await generateGrid(gridName, sections);
  };

  return (
    <Container>
      <Form onSubmit={handleCreateGrid}>
        <Form.Label>Fill the fields to create the grid name</Form.Label>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group controlId="formCourse">
              <Form.Control
                type="text"
                placeholder="Enter course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formYear">
              <Form.Control
                type="number"
                placeholder="Enter year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formLab">
              <Form.Control
                type="text"
                placeholder="Enter lab"
                value={lab}
                onChange={(e) => setLab(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formMore">
              <Form.Control
                type="text"
                placeholder="Optional"
                value={more}
                onChange={(e) => setMore(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <div>
          <Form.Label>
            The generated name will be like this : PCO-2024-lab02-more
          </Form.Label>
        </div>
        <Button variant="primary" onClick={addSection} className="mb-3">
          Add Section
        </Button>
        <div>
          {sections.map((section) => (
            <div
              key={section.id}
              className="border p-3 mb-3 rounded"
              style={{ backgroundColor: "white" }}
            >
              <SectionForm
                section={section}
                onChange={handleSectionChange}
                onRemove={removeSection}
              />
              <Button
                variant="secondary"
                onClick={() => addSubSection(section.id)}
                className="mb-3"
              >
                Add Subsection
              </Button>
              {section.subsections.map((subSection) => (
                <SubSectionForm
                  key={subSection.id}
                  subSection={subSection}
                  onChange={(field, value) =>
                    handleSubSectionChange(
                      section.id,
                      subSection.id,
                      field,
                      value
                    )
                  }
                  onRemove={(id) => removeSubSection(section.id, id)}
                />
              ))}
            </div>
          ))}
        </div>
        <Button variant="success" type="submit">
          Generate grid
        </Button>
      </Form>
    </Container>
  );
};

export default GridCreatePage;
