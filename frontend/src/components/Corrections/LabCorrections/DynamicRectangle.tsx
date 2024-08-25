import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Modal, Badge } from "react-bootstrap";
import CorrectionCarousel from "./CorrectionCarousel";
import {
  Correction,
  CorrectionData,
  Section,
  Student,
  Subsection,
} from "../../../../types/CorrectionTypes";
import "./DynamicRectangles.css";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  calculateAverageClassGrade,
  calculateTotalResult,
} from "@/app/lib/corrections/marks";
import { deleteCorrection } from "@/app/lib/data/correction";

const DynamicRectangles: React.FC<{
  labId: number;
  sections: Section[];
  students: Student[];
  corrections: Correction[];
  correctionData: CorrectionData[];
  setCorrectionData: React.Dispatch<React.SetStateAction<CorrectionData[]>>;
}> = ({ labId, sections, students, corrections, correctionData, setCorrectionData }) => {
  const [nextId, setNextId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  // const [correctionData, setCorrectionData] = useState<CorrectionData[]>([]);

  const isModalClosing = useRef(false);

  const addItem = () => {
    const tmpSections = sections;
    tmpSections.map((section: Section) => {
      section.subsections.map((subsection: Subsection) => {
        subsection.result = 0;
      });
    });
    setCorrectionData((prev) => [
      ...prev,
      {
        itemId: nextId,
        labId: labId,
        appreciation: "",
        students: [],
        sections: tmpSections,
      },
    ]);

    setNextId((prevId) => prevId + 1);
    setActiveIndex(correctionData.length);
    setShowModal(true);
  };

  const removeItem = (id: number) => {
      deleteCorrection(id);

      setCorrectionData((prev) => prev.filter((item) => item.itemId !== id));
      setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const confirmRemoveItem = (id: number) => {
    setItemToRemove(id);
    setShowConfirmation(true);
  };

  const doNotRemoveItem = () => {
    setShowConfirmation(false);
    setShowModal(true);
  };

  const handleRemoveConfirmed = () => {
    if (itemToRemove !== null) {
      removeItem(itemToRemove);
    }

    setShowConfirmation(false);
  };

  const handleShowModal = (index: number) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  const saveCorrectionToAPI = async (correction: CorrectionData, index: number) => {
    try {
      const response = await fetch(
        "/api/data/correction/create-update-correction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(correction),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save correction");
      }

      const savedCorrection = await response.json(); // Get the created/updated correction from the response
      console.log("Correction saved successfully:", savedCorrection);
      // Update correctionData with the new id
      setCorrectionData((prevData) => {
        const newData = [...prevData];
        newData[index].id = savedCorrection.correction.id; // Update the id in the current correction data
        return newData;
      });
    } catch (error) {
      console.error("Error saving correction:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    isModalClosing.current = false;
    const correcton = correctionData[activeIndex];
    if (correcton.students.length <= 0) {
      confirmRemoveItem(correcton.itemId);
    } else {
      saveCorrectionToAPI(correcton, activeIndex); // Save correction to API
    }
  };

  const handleButtonClick = (id: number) => {
    console.log("Button clicked for item ID:", id);
  };

  const saveCorrectionData = () => {};
  console.log("MAMAMAMA ->", correctionData);
  return (
    <>
      <div className="d-flex flex-wrap">
        <Card className="add-button-card" onClick={addItem}>
          +
        </Card>
        {correctionData.map((correction, index) => (
          <Card
            key={correction.itemId}
            className="existing-rectangle-card"
            onClick={() => handleShowModal(index)}
          >
            <div className="student-names">
              {correction.students.map((student) => {
                return (
                  <div className="student-name-item" key={student.id}>
                    <p>{student.name}</p>
                  </div>
                );
              })}
            </div>
            <div className="result">
              {calculateTotalResult(correction.sections)}
            </div>
            <Button
              variant="danger"
              className="remove-button"
              onClick={(e) => {
                e.stopPropagation();
                confirmRemoveItem(correction.itemId);
              }}
            >
              x
            </Button>
          </Card>
        ))}
      </div>
      {correctionData.length > 0 && (
        <Card className="mt-4 text-center">
          <Card.Body>
            <Card.Title>Average</Card.Title>
            <h2>
              <Badge style={{ fontSize: "1rem", padding: "10px 20px" }}>
                {calculateAverageClassGrade(correctionData)}
              </Badge>{" "}
            </h2>
          </Card.Body>
        </Card>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Correction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CorrectionCarousel
            correctionData={correctionData}
            activeIndex={activeIndex}
            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
            onButtonClick={handleButtonClick}
            labId={labId}
            sections={sections}
            students={students}
            handleSlide={() => {
              if (!isModalClosing.current) {
                saveCorrectionData();
              }
            }}
            setCorrectionData={setCorrectionData}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveCorrectionData} variant="success">
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmationModal
        show={showConfirmation}
        text="Do you really want to delete this correction and lose all the data?"
        onConfirm={handleRemoveConfirmed}
        onCancel={doNotRemoveItem}
      />
    </>
  );
};

export default DynamicRectangles;
