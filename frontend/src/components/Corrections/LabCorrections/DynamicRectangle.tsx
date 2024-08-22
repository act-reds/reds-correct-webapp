import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import CorrectionCarousel from "./CorrectionCarousel";
import { CorrectionData } from "../../../../types/CorrectionTypes";
import "./DynamicRectangles.css";
import ConfirmationModal from "@/components/ConfirmationModal";

const DynamicRectangles: React.FC<{ labId: number }> = ({ labId }) => {
  const [nextId, setNextId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [correctionData, setCorrectionData] = useState<CorrectionData[]>([]);

  const isModalClosing = useRef(false);

  const addItem = () => {
    setCorrectionData((prev) => [
      ...prev,
      {
        itemId: nextId,
        labId: labId,
        appreciation: "",
        students: [],
        subsectionMarks: [],
      },
    ]);

    setNextId((prevId) => prevId + 1);
    setActiveIndex(correctionData.length);
    setShowModal(true);
  };

  const removeItem = (id: number) => {
    if (id !== null) {
      setCorrectionData((prev) => prev.filter((item) => item.itemId !== id));
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
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

  const handleCloseModal = () => {
    setShowModal(false);
    isModalClosing.current = false;
    if (correctionData[activeIndex].students.length <= 0) {
      confirmRemoveItem(correctionData[activeIndex].itemId);
    }
  };

  const handleButtonClick = (id: number) => {
    console.log("Button clicked for item ID:", id);
  };

  const saveCorrectionData = () => {};

  //   useEffect(() => {
  //     console.log("data", correctionData);
  //   }, [correctionData]);

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
            <div className="result">5</div>
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
