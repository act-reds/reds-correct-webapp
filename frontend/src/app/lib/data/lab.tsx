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
