"use client";

import Accordion from "react-bootstrap/Accordion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useRouter } from "next/navigation";
import { fetchCourses } from "../lib/data/getCourses";
import { getCourseFromId, getCoursesForAssistant } from "../lib/data/courses";
import { createCourse } from "../lib/data/addNewCourse";

const CorrectionsPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    "0"
  );
  let email: string = "";

  if (session?.user?.email) {
    email = session?.user?.email;
  }

  const [courses, setCourses] = useState<any[]>([]);

  const handleSubmitNewCourse = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const year = formData.get("selectedYear") as string;
    const name = formData.get("courseName") as string;
    // Log the course name to the console
    console.log("Course Name:", name);

    // Check if the course name is valid (you can add more validation here)
    if (name.trim() === "") {
      alert("Please enter a course name.");
      return;
    }

    // Check if a year was selected
    if (year === "" || year === "Select year") {
      alert("Please select a year.");
      return;
    }

    createCourse(name, parseInt(year, 10), email);

    alert(`The course "${name} - ${year}" was successfully created.`);
    setActiveAccordionKey("0");
  };

  const handleSelectCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = parseInt(formData.get("selectedCourse") as string, 10);

    if (isNaN(id)) {
      alert("Please select a valid course");
      return;
    }

    try {
      // Assuming getCourseFromId is an async function that fetches the course details by ID
      const course = await getCourseFromId(id);

      if (!course) {
        alert("Course not found");
        return;
      }

      router.push(
        `/corrections/${encodeURIComponent(course.name)}/${encodeURIComponent(
          course.year.toString()
        )}/${encodeURIComponent(id).toString()}`
      );
    } catch (error) {
      console.error("Failed to retrieve course:", error);
      alert("An error occurred while retrieving the course. Please try again.");
    }
  };
  const handleAccordionClick = (eventKey: string | null) => {
    setActiveAccordionKey(eventKey);
  };

  // Generate options for years between 2022 and 2050
  const yearOptions: JSX.Element[] = [];
  for (let year = 2022; year <= 2050; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  useEffect(() => {
    async function loadCourses() {
      try {
        const allCourses = await getCoursesForAssistant(session?.user?.email); // Make sure to await the promise
        setCourses(allCourses);
        console.log(allCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Fallback to an empty array in case of an error
      }
    }

    if (session) {
      loadCourses();
    }
  }, [session, courseName, activeAccordionKey]);

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Select an existing course</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSelectCourse}>
              <Form.Select aria-label="Select course" name="selectedCourse">
                <option>Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.year})
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
          <Accordion.Header>Create a new course</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmitNewCourse}>
              <Form.Group className="mb-3" controlId="formCourseName">
                <Form.Control
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  name="courseName"
                />
                <Form.Text className="text-muted">
                  e.g.: PCO, PTR, SYL
                </Form.Text>
                <Form.Select
                  aria-label="Select Year"
                  name="selectedYear"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Select year</option>
                  {yearOptions}
                </Form.Select>
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

export default CorrectionsPage;
