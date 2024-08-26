// components/SelectAssistants.tsx

import React from "react";
import dynamic from "next/dynamic";
import { Assistant } from "../../../types/CorrectionTypes";

// Dynamically import the Select component
const Select = dynamic(() => import("react-select"), { ssr: false });

interface SelectAssistantsProps {
  assistants: Assistant[];
  selectedAssistants: Assistant[];
  onChange: (selectedOptions: any) => void;
}

const SelectAssistants: React.FC<SelectAssistantsProps> = ({
  assistants,
  selectedAssistants,
  onChange,
}) => {
  // Generate options for Select component
  const options = assistants.map((assistant) => ({
    value: assistant.id,
    label: assistant.mail,
    data: assistant,
  }));

  const value = selectedAssistants.map((assistant) => ({
    value: assistant.id,
    label: assistant.mail,
    data: assistant,
  }));

  return (
    <div className="select-assistants">
      <label>Select Assistants</label>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Search and select assistants"
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        isClearable
      />
    </div>
  );
};

export default SelectAssistants;
