"use client";

import Accordion from "react-bootstrap/Accordion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import { getCourseFromId, getCoursesForAssistant } from "../lib/data/courses";
import { createCourse } from "../lib/data/addNewCourse";
import QuickSelectLab from "@/components/Corrections/QuickSelectLab";
import { Assistant } from "../../../types/CorrectionTypes";
import SelectAssistants from "@/components/Corrections/SelectAssistants";

const CorrectionsPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(
    "0"
  );
  const [courses, setCourses] = useState<any[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistants, setSelectedAssistants] = useState<Assistant[]>([]);
  const [searchAssistants, setSearchAssistants] = useState<Assistant[]>([]);

  let email: string = "";

  if (session?.user?.email) {
    email = session?.user?.email;
  }

  useEffect(() => {
    async function loadAssistants() {
      try {
        const response = await fetch("/api/data/assistants");
        if (!response.ok) {
          throw new Error("Failed to fetch assistants");
        }
        const data = await response.json();
        setAssistants(data);
        setSearchAssistants(data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    }

    async function loadCourses() {
      try {
        const allCourses = await getCoursesForAssistant(session?.user?.email);
        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      }
    }

    if (session) {
      loadCourses();
      loadAssistants();
    }
  }, [session]);

  const handleSubmitNewCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const year = formData.get("selectedYear") as string;
    const name = formData.get("courseName") as string;

    if (name.trim() === "") {
      alert("Please enter a course name.");
      return;
    }

    if (year === "" || year === "Select year") {
      alert("Please select a year.");
      return;
    }

    // Extract email addresses from selectedAssistants
    let assistantEmails = [...selectedAssistants.map((a) => a.mail), email];

    const filterAssistantEmails = assistantEmails.filter(
      (item, index) => assistantEmails.indexOf(item) === index
    );

    try {
      const newCourse = await createCourse(
        name,
        parseInt(year, 10),
        filterAssistantEmails
      );
      alert(`The course "${name} - ${year}" was successfully created.`);

      // Add the new course to the existing list of courses
      setCourses([...courses, newCourse]);

      // Reset form fields and set accordion to the default state
      setCourseName("");
      setSelectedYear("");
      setSelectedAssistants([]);
      setActiveAccordionKey("0");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course.");
    }
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

  const handleAssistantChange = (selectedOptions: any) => {
    const newSelectedAssistants = selectedOptions
      ? selectedOptions.map((option: any) => option.data)
      : [];
    setSelectedAssistants(newSelectedAssistants);
    // Update the searchable assistants if necessary
    setSearchAssistants(
      assistants.filter(
        (a) => !newSelectedAssistants.find((sa) => sa.id === a.id)
      )
    );
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

  return (
    <>
      <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionClick}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Select an existing course</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSelectCourse}>
              <Form.Group className="mb-3" controlId="formClassSel">
                <Form.Select aria-label="Select course" name="selectedCourse">
                  <option>Select course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.year})
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

              <Form.Group className="mb-3">
                <SelectAssistants
                  assistants={searchAssistants}
                  selectedAssistants={selectedAssistants}
                  onChange={handleAssistantChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Add
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {session?.user?.email && (
        <QuickSelectLab assistantMail={session?.user?.email} />
      )}
      <style jsx>{`
        .selected-assistant {
          background-color: #f8f9fa;
        }
        .selected-assistant span {
          flex: 1;
        }
        .selected-assistant button {
          margin-left: auto;
        }
      `}</style>
    </>
  );
};

export default CorrectionsPage;
