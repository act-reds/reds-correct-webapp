"use client";

export async function createCourse(
  name: string,
  year: number,
  assistantEmails: string[] // Accept an array of emails
) {
  try {
    const response = await fetch("/api/data/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        year,
        assistantEmails, // Send the array of emails
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create course");
    }

    const newCourse = await response.json();
    return newCourse;
  } catch (error) {
    console.error(error);
    return null;
  }
}
