export async function createLab(
  name: string,
  classId: number
): Promise<{ success: boolean; lab?: any; error?: string }> {
  try {
    const response = await fetch("/api/data/lab/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, classId }),
    });

    // Parse the JSON response
    const result = await response.json();

    return { success: result.success, lab: result.lab };
  } catch (error) {
    console.error("Error adding lab:", error);
    return {
      success: false,
      error: "Failed to add lab due to a network error.",
    };
  }
}

export async function getGridSections(gridId: number) {
  try {
    const response = await fetch(`/api/data/grids/${gridId}/sections`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sections for gridId: ${gridId}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

export async function getLabData(labId: number) {
  try {
    const response = await fetch(`/api/data/lab/${labId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch lab details");
    }
    const labData = await response.json();
    return labData;
  } catch (error) {
    console.error("Error fetching lab details:", error);
    return [];
  }
}
