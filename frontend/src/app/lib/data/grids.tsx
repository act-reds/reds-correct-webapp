import { Section } from "../../../../types/GridTypes";

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

export async function generateGrid(grid: Section[]) {
  try {
    return [];
  } catch (error) {
    console.error("Error creating grid:", error);
    return [];
  }
}
