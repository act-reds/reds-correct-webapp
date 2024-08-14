"use client";

import { handleFileUpload } from "@/app/code/utils/files/xlsx";
import {
  addStudentsToClass,
  createClass,
  fetchClasses,
  getClass,
  getClassId,
} from "@/app/lib/data/classes";
import { addStudents, fetchStudentIdsByEmails } from "@/app/lib/data/students";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Accordion, Button, Form, Table } from "react-bootstrap";

const CoursePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const [classes, setClassses] = useState<any[]>([]);
  const [fileData, setFileData] = useState<any[][]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState<string>("");
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    "0"
  );

  const courseId = parseInt(params.id as string, 10);

  // Handle class selection and redirection
  const handleClassSelect = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedClassId = formData.get("selectedClass") as string;

    if (!selectedClassId || selectedClassId === "Select class") {
      alert("Select a class");
      return;
    }

    const classData = await getClass(parseInt(selectedClassId, 10));
    // Route to the desired page
    router.push(
      `/corrections/${params.courseName}/${params.year}/${params.id}/${classData.name}/${selectedClassId}`
    );
  };

  // Handle form submission for adding class and students
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (students.length === 0 || !newClassName) {
      alert("No student data or class name to add.");
      return;
    }

    // Log the students data to the console
    console.log("Students data to be sent:", students);
    try {
      // Add students if they are not already
      await addStudents(students);

      const exists = await createClass(newClassName, courseId);

      if (exists) {
        alert(`The class ${newClassName} already exists for this course.`);
        return;
      }

      const classId = await getClassId(newClassName, courseId);
      console.log("ClassId = classId");

      // Extract emails from students array
      const emails = students.map((student) => student.mail);
      // Get the students ids to add the students to the class
      const { studentIds } = await fetchStudentIdsByEmails(emails);

      await addStudentsToClass(classId, studentIds);
    } catch (error) {
      console.error("Error adding class and students:", error);
      alert("Failed to add class and students.");
      return;
    }
    const tmpClasses = await fetchClasses(courseId);
    setClassses(tmpClasses);
    setActiveAccordionKey("0");
  };

  const handleAccordionClick = (eventKey: string | null) => {
    setActiveAccordionKey(eventKey);
  };

  useEffect(() => {
    async function loadCourses() {
      const tmpClasses = await fetchClasses(courseId);
      setClassses(tmpClasses);
    }

    loadCourses();
  }, []);

  console.log(classes);

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Existing classes</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleClassSelect}>
              <Form.Select aria-label="Select class" name="selectedClass">
                <option>Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Add class</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formClassName">
                <Form.Control
                  placeholder="Enter class name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
                <Form.Text className="text-muted">e.g.: A, B, C</Form.Text>
                <Form.Group className="mt-3">
                  <Form.Label>Upload .xlsx File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".xlsx"
                    onChange={(event) =>
                      handleFileUpload(event, setFileData, setStudents)
                    }
                  />
                </Form.Group>
              </Form.Group>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Form>
            {/* Display parsed file data in a table */}
            {fileData.length > 0 && (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    {fileData[0].map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default CoursePage;
