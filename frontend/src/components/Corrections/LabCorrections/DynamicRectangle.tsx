import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import "./DynamicRectangles.css";
import CorrectionCarousel from "./CorrectionCarousel";
import { CorrectionData } from "../../../../types/CorrectionTypes";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Item {
  id: number;
}

const DynamicRectangles: React.FC<{ labId: number }> = ({ labId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  // Ref to track if the modal is being closed intentionally by the user
  const isModalClosing = useRef(false);

  const [correctionData, setCorrectionData] = useState<CorrectionData>({
    labId: labId,
    appreciation: "",
    students: [],
    subsectionMarks: [],
  });

  const addItem = () => {
    setItems((prevItems) => [...prevItems, { id: nextId }]);
    setNextId((prevId) => prevId + 1);
    setActiveIndex(items.length);
    setShowModal(true);
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    if (activeIndex >= items.length - 1) {
      setActiveIndex((prev) => Math.max(items.length - 2, 0));
    }
  };

  const handleShowModal = (index: number) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    isModalClosing.current = true; // Mark that the modal is closing
    const ret = saveCorrectionData();
    if (!ret) {
      setItemToRemove(items[activeIndex]?.id ?? null);
      setShowConfirmation(true);
    } else {
      setShowModal(false);
    }
    isModalClosing.current = false; // Mark that the modal is closing
  };

  const handleConfirmClose = () => {
    if (itemToRemove !== null) {
      removeItem(itemToRemove);
    }
    setShowConfirmation(false);
    setShowModal(false);
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
    setShowModal(false);
  };

  const handleButtonClick = (id: number) => {
    console.log("Button clicked for item ID:", id);
  };

  const saveCorrectionData = () => {
    if (correctionData.students.length <= 0) {
      alert("You can't save a correction if there are no students selected.");
      return false;
    }
    return true;
  };

  return (
    <div>
      <div className="d-flex flex-wrap">
        <Card className="add-button-card" onClick={addItem}>
          +
        </Card>

        {items.map((item) => (
          <Card
            key={item.id}
            className="existing-rectangle-card"
            onClick={() => handleShowModal(items.indexOf(item))}
          >
            <div>{item.id}</div>
            <Button
              variant="danger"
              className="remove-button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
            >
              Remove
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
            items={items}
            activeIndex={activeIndex}
            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
            onButtonClick={handleButtonClick}
            labId={labId}
            handleSlide={() => {
              // Only handle slide if modal is not closing
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
        text="Do you really want to close the current correction and lose all the data?"
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </div>
  );
};

export default DynamicRectangles;
