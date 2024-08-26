"use client";

import { getClass } from "@/app/lib/data/classes"; // Ensure this is correctly implemented
import { createLab } from "@/app/lib/data/lab";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";

// Helper function to fetch labs
const fetchLabs = async (classId: number): Promise<any[]> => {
  try {
    const response = await fetch(`/api/data/lab/get-lab?classId=${classId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch labs");
    }
    const data = await response.json();
    return data.labs || [];
  } catch (error) {
    console.error("Error fetching labs:", error);
    return [];
  }
};

const ClassDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const courseId = parseInt(params.id as string, 10);
  const classId = parseInt(params.classId as string, 10);

  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    "0"
  );
  const [labs, setLabs] = useState<any[]>([]);
  const [newLabName, setNewLabName] = useState<string>("");

  // Fetch existing labs on component mount
  useEffect(() => {
    const loadLabs = async () => {
      const existingLabs = await fetchLabs(classId);
      setLabs(existingLabs);
    };

    loadLabs();
  }, [classId, activeAccordionKey]);

  const handleSubmitSelectedLab = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userInput = formData.get("selectedLab") as string;
    if (userInput === "Select lab") {
      alert("Please select a lab.");
      return;
    }

    const labId = parseInt(userInput as string, 10);
    const labName = labs.find((lab) => lab.id === labId).name;

    // if()
    router.push(
      `/corrections/${params.courseName}/${params.year}/${params.id}/${params.className}/${params.classId}/${labName}/${userInput}`
    );
  };

  // Handle form submission for adding a new lab
  const handleSubmitLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabName) {
      alert("Please enter a lab name.");
      return;
    }

    const result = await createLab(newLabName, classId);

    if (result.success) {
      const updatedLabs = await fetchLabs(classId);
      setLabs(updatedLabs);
      setNewLabName(""); // Clear the input field
    } else {
      alert(`${newLabName} already exists for this course.`);
      return;
    }

    setActiveAccordionKey("0");
  };

  const handleAccordionClick = (eventKey: string | null) => {
    setActiveAccordionKey(eventKey);
  };

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Existing labs</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmitSelectedLab}>
              <Form.Group className="mb-3" controlId="formLabSel">
                <Form.Select aria-label="Select Lab" name="selectedLab">
                  <option>Select lab</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Add lab</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmitLab}>
              <Form.Group className="mb-3" controlId="formLabName">
                <Form.Control
                  placeholder="Enter lab name"
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                />
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

export default ClassDetailsPage;
