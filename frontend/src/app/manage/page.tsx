"use client";

import React, { useEffect, useState } from "react";
import { Course, Assistant } from "../../../types/CorrectionTypes";
import { useSession } from "next-auth/react";
import { getFullCoursesForAssistant } from "../lib/data/courses";
import Accordion from "react-bootstrap/Accordion";
import FilterableSelect from "@/components/FilterableSelect"; // Import the FilterableSelect component
import { Option } from "../../../types/GlobalTypes";
import ModalPopup from "@/components/ModalPopup";

const ManageComponent: React.FC = () => {
  const { data: session } = useSession();
  const assistantEmail = session?.user?.email;
  const [courses, setCourses] = useState<Course[]>([]);
  const [allAssistants, setAllAssistants] = useState<Assistant[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null); // Track the active course
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State to store the modal message

  useEffect(() => {
    async function loadAssistants() {
      console.log("je passe par la");
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

          tmpData.sort((a, b) => a.name.localeCompare(b.name));
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

  const updateCourseAssistant = async () => {
    if (activeKey !== null) {
      const courseId = parseInt(activeKey);
      const course = courses.find((c) => c.id === courseId);

      if (course) {
        console.log("Updating Assistants for Course:", courseId);

        try {
          // Make the API call to update the assistants
          const response = await fetch(
            `/api/data/courses/${courseId}/update-assistants`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                assistants: course.assistants,
              }),
            }
          );

          const result = await response.json();
          if (response.ok) {
            console.log("Assistants updated successfully:", result.message);

            // Show the modal with success message
            setModalMessage("The assistants of the course have been updated!");
            setShowModal(true);
          } else {
            console.error("Failed to update assistants:", result.error);
          }
        } catch (error) {
          console.error("Error updating assistants:", error);
        }
      } else {
        console.error("Course not found:", courseId);
      }
    } else {
      console.error("No active key set.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

      {/* Include the modal component here */}
      <ModalPopup
        show={showModal}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ManageComponent;
