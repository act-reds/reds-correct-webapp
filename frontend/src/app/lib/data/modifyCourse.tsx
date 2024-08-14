"use client";

export async function updateCourse(
  id: number,
  name: string,
  year: number,
  assistantEmail: string
) {
  try {
    const response = await fetch("/api/data/courses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        year,
        assistantEmail,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update course");
    }

    const updatedCourse = await response.json();
    console.log(updatedCourse);
    return updatedCourse;
  } catch (error) {
    console.error(error);
    return null;
  }
}
