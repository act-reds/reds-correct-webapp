"use client";

export async function fetchStudentIdsByEmails(
  emails: string[]
): Promise<{ studentIds: number[] }> {
  try {
    const response = await fetch("/api/data/student/get-ids-by-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    return await response.json(); // Ensure this returns an object with studentIds property
  } catch (error) {
    console.error("Error fetching student IDs by email:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function addStudents(
  students: { name: string; formation: string; mode: string; mail: string }[]
): Promise<void> {
  try {
    const response = await fetch("/api/data/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error("Error adding students:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
