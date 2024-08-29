import React, { useState } from "react";
import {
  Form,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { Controller, UseFormReturn } from "react-hook-form";

interface Assistant {
  id: number;
  mail: string;
}

interface MultipleSelectChoiceProps {
  assistants: Assistant[];
  setValue: UseFormReturn["setValue"];
  formName: string; // Field name for the form value
  formValues: string[];
}

const MultipleSelectChoice: React.FC<MultipleSelectChoiceProps> = ({
  assistants,
  setValue,
  formName,
  formValues,
}) => {
  const [selectedCC, setSelectedCC] = useState<string[]>(formValues || []);

  const handleAddCC = (email: string) => {
    if (email && !selectedCC.includes(email)) {
      const updatedCC = [...selectedCC, email];
      setSelectedCC(updatedCC);
      setValue(formName, updatedCC);
    }
  };

  const handleRemoveCC = (email: string) => {
    const updatedCC = selectedCC.filter((cc) => cc !== email);
    setSelectedCC(updatedCC);
    setValue(formName, updatedCC);
  };

  return (
    <>
      <InputGroup>
        <FormControl
          as="select"
          onChange={(e) => handleAddCC(e.target.value)}
          value=""
        >
          <option value="">Select a CC recipient</option>
          {assistants.map((assistant) => (
            <option key={assistant.id} value={assistant.mail}>
              {assistant.mail}
            </option>
          ))}
        </FormControl>
      </InputGroup>
      <ListGroup>
        {selectedCC.map((cc, index) => (
          <ListGroup.Item key={index}>
            {cc}
            <Button
              variant="outline-danger"
              size="sm"
              className="float-end"
              onClick={() => handleRemoveCC(cc)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default MultipleSelectChoice;
