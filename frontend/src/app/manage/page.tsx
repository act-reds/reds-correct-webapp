"use client";

import React, { useEffect, useState } from "react";
import { Course, Assistant } from "../../../types/CorrectionTypes";
import { useSession } from "next-auth/react";
import { getFullCoursesForAssistant } from "../lib/data/courses";
import Accordion from "react-bootstrap/Accordion";
import FilterableSelect from "@/components/FilterableSelect"; // Import the FilterableSelect component
import { Option } from "../../../types/GlobalTypes";

const ManageComponent: React.FC = () => {
  const { data: session } = useSession();
  const assistantEmail = session?.user?.email;
  const [courses, setCourses] = useState<Course[]>([]);
  const [allAssistants, setAllAssistants] = useState<Assistant[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null); // Track the active course

  useEffect(() => {
    async function loadAssistants() {
      try {
        const response = await fetch("/api/data/assistants");
        if (!response.ok) {
          throw new Error("Failed to fetch assistants");
        }
        const data = await response.json();
        setAllAssistants(data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    }

    async function updateCourse() {
      try {
        if (assistantEmail) {
          const tmpData: Course[] = await getFullCoursesForAssistant(
            assistantEmail
          );
          setCourses(tmpData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    if (assistantEmail) {
      updateCourse();
      loadAssistants();
    }
  }, [assistantEmail]);

  const handleSelectionChange = (courseId: number, selectedItems: Option[]) => {
    console.log("Selected Items:", selectedItems); // Debugging
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assistants: selectedItems.map((item) => ({
                id: item.id,
                mail: item.label,
              })),
            }
          : course
      )
    );
  };

  // Prepare the options for each FilterableSelect component based on all assistants
  const getAssistantOptions = (course: Course) =>
    course.assistants.map((assistant) => ({
      id: assistant.id,
      label: assistant.mail,
    }));

  const getAllAssistantOptions = () =>
    allAssistants.map((assistant) => ({
      id: assistant.id,
      label: assistant.mail,
    }));

  const handleActiveKeyChange = (key: string | null) => {
    setActiveKey(key);
  };

  const updateCourseAssistant = () => {
    if (activeKey !== null) {
      const courseId = parseInt(activeKey);
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        const selectedAssistants = getAssistantOptions(course);
        console.log("Current Selection:", selectedAssistants);
      } else {
        console.error("Course not found:", courseId);
      }
    } else {
      console.error("No active key set.");
    }
  };

  return (
    <div className="container mt-4">
      <Accordion
        defaultActiveKey="0"
        activeKey={activeKey}
        onSelect={handleActiveKeyChange}
      >
        {courses.map((course: Course, index) => (
          <Accordion.Item eventKey={String(course.id)} key={course.id}>
            <Accordion.Header>
              {course.name} - {course.year}
            </Accordion.Header>
            <Accordion.Body>
              <h5>Assistants</h5>
              <FilterableSelect
                options={getAllAssistantOptions()}
                onSelectionChange={(selectedItems) =>
                  handleSelectionChange(course.id, selectedItems)
                }
                currentSelection={getAssistantOptions(course)}
                placeHolder="Select assistant to add..."
              />
              <div className="mt-3 text-end">
                {" "}
                <button
                  className="btn btn-primary"
                  onClick={updateCourseAssistant}
                >
                  Update
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default ManageComponent;
