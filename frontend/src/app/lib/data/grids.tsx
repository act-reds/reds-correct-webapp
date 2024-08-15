import { GridData, Section } from "@/components/Grid/GridCreatePage/types";

export async function fetchGrids(): Promise<any[]> {
  try {
    const response = await fetch("/api/data/grids/get-grids"); // Adjust the endpoint as needed
    if (!response.ok) {
      throw new Error("Failed to fetch grids");
    }
    const data = await response.json();
    return data.grids || [];
  } catch (error) {
    console.error("Error fetching grids:", error);
    return [];
  }
}

export async function generateGrid(
  gridName: string,
  sections: Section[]
): Promise<any> {
  try {
    const gridData: GridData = {
      name: gridName,
      sections,
    };

    const response = await fetch("/api/data/grids/generate-grid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Grid created successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to create grid:", error);
    throw error;
  }
}
