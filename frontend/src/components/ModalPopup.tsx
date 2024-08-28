import React from "react";
import { Modal, Button } from "react-bootstrap"; // Using react-bootstrap for modal styling

interface ModalPopupProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

const ModalPopup: React.FC<ModalPopupProps> = ({ show, message, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopup;
