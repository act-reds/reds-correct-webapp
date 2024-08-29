import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Option } from "../../types/GlobalTypes"; // Assuming Option is defined in GlobalTypes
import { Button, Form, ListGroup } from "react-bootstrap";

interface FilterableSelectProps {
  options: Option[];
  currentSelection: Option[];
  onSelectionChange: (selectedItems: Option[]) => void; // Callback to parent component
  placeHolder: string;
}

const FilterableSelect: React.FC<FilterableSelectProps> = ({
  options,
  currentSelection,
  onSelectionChange,
  placeHolder,
}) => {
  const [selectedItems, setSelectedItems] =
    useState<Option[]>(currentSelection); // Initialize state with currentSelection
  const [availableOptions, setAvailableOptions] = useState<Option[]>(options);
  const [selectedItem, setSelectedItem] = useState<string>("");

  useEffect(() => {
    setSelectedItems(currentSelection); // Update state when currentSelection changes
  }, [currentSelection]);

  useEffect(() => {
    // Update available options to exclude already selected items
    const filteredOptions = options.filter(
      (option) => !selectedItems.find((selected) => selected.id === option.id)
    );
    setAvailableOptions(filteredOptions);
  }, [selectedItems, options]);

  // Convert the selected items to the format required by react-select
  const selectedOptions = selectedItems.map((item) => ({
    value: item.id,
    label: item.label,
  }));

  const handleSelectChange = (selectedOption: any) => {
    // Handle changes in the select component
    const newSelectedItems = Array.isArray(selectedOption)
      ? selectedOption.map((option: any) => ({
          id: option.value,
          label: option.label,
        }))
      : [];

    setSelectedItems(newSelectedItems);
    onSelectionChange(newSelectedItems); // Notify parent component
  };

  const handleSelectStudent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    if (selectedName) {
      const option = options.find((opt) => opt.label === selectedName);
      if (option && !selectedItems.some((s) => s.id === option.id)) {
        setSelectedItems((prev) => [
          ...prev,
          { id: option.id, label: selectedName },
        ]);
        setSelectedItem("");
        onSelectionChange([...selectedItems, option]);
      }
    }
  };

  const handleRemoveItem = (id: number) => {
    if (selectedItems.length > 1) {
      const updatedSelection = selectedItems.filter((item) => item.id !== id);
      setSelectedItems(updatedSelection);
      onSelectionChange(updatedSelection); // Notify parent component
    }
  };

  return (
    <div>
      <Form.Select
        value={selectedItem}
        onChange={handleSelectStudent}
        aria-label="Choose option"
      >
        <option value="">{placeHolder}</option>
        {availableOptions.map((option) => (
          <option key={option.id} value={option.label}>
            {option.label}
          </option>
        ))}
      </Form.Select>

      <ListGroup className="mt-3">
        {selectedItems.length > 0 &&
          selectedItems.map((item) => (
            <ListGroup.Item key={item.id}>
              {item.label}
              <Button
                variant="danger"
                size="sm"
                className="float-end"
                onClick={() => handleRemoveItem(item.id)}
              >
                x
              </Button>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default FilterableSelect;
