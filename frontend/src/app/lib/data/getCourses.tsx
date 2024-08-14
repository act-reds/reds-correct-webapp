"use client";

export async function fetchCourses(): Promise<any[]> {
  try {
    const response = await fetch("/api/data/courses", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const courses = await response.json();
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
