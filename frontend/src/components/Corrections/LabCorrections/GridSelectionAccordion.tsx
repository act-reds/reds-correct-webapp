"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Form, Spinner, Button, Alert } from "react-bootstrap";
import SectionTable from "@/components/Grid/SectionTable";
import { fetchGrids } from "@/app/lib/data/grids";
import { getGridSections } from "@/app/lib/data/lab";

const Select = dynamic(() => import("react-select"), { ssr: false });

const updateLabWithGrid = async (labId: number, gridId: number) => {
  try {
    const response = await fetch(`/api/data/lab/${labId}/update-grid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gridId }),
    });
    if (!response.ok) {
      throw new Error("Failed to update lab with grid");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating lab with grid:", error);
    throw error;
  }
};

interface GridSelectionAccordionProps {
  labId: number;
  courseName: string;
  labName: string;
  setActiveAccordionKey: (key: string | null) => void;
  onGridUpdated: () => void; // Callback function for notifying parent component
}

const GridSelectionAccordion: React.FC<GridSelectionAccordionProps> = ({
  labId,
  courseName,
  labName,
  setActiveAccordionKey,
  onGridUpdated, // Destructure the callback function
}) => {
  const [grids, setGrids] = useState<{ id: string; name: string }[]>([]);
  const [selectedGrid, setSelectedGrid] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [gridDetails, setGridDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadGrids = async () => {
      const existingGrids = await fetchGrids();
      setGrids(existingGrids);
    };

    loadGrids();
  }, []);

  const handleSelectChange = async (selectedOption: any) => {
    setSelectedGrid(
      selectedOption
        ? { id: selectedOption.value, name: selectedOption.label }
        : null
    );
    if (selectedOption) {
      setLoading(true);
      try {
        const fetchedDetails = await getGridSections(selectedOption.value);
        setGridDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching grid details:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setGridDetails(null);
    }
  };

  const handleNextClick = async () => {
    if (labId && selectedGrid) {
      try {
        await updateLabWithGrid(labId, parseInt(selectedGrid.id, 10));
        alert(`${selectedGrid.name} is linked to [${courseName} - ${labName}]`);
        setActiveAccordionKey("1");
        onGridUpdated(); // Notify parent component to re-fetch lab data
      } catch (error) {
        setApiError("Failed to update lab with grid. Please try again.");
      }
    } else {
      setApiError("Please select a grid before proceeding.");
    }
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="selectGrid">
        <Select
          options={grids.map((grid) => ({
            value: grid.id,
            label: grid.name,
          }))}
          onChange={handleSelectChange}
          placeholder="Search and select grid"
          value={
            selectedGrid
              ? { value: selectedGrid.id, label: selectedGrid.name }
              : null
          }
        />
      </Form.Group>
      {selectedGrid && (
        <div className="mt-4">
          {loading ? (
            <Spinner animation="border" />
          ) : gridDetails ? (
            <SectionTable sections={gridDetails} />
          ) : (
            <p>No details available for the selected grid.</p>
          )}
        </div>
      )}
      {apiError && <Alert variant="danger">{apiError}</Alert>}
      <Button variant="primary" type="button" onClick={handleNextClick}>
        Next
      </Button>
    </Form>
  );
};

export default GridSelectionAccordion;
