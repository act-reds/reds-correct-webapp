export async function getCoursesForAssistant(assistant_mail: string) {
  try {
    console.log(assistant_mail);
    // Step 1: Get the assistantId from the email
    const assistantIdResponse = await fetch("/api/data/assistant/get-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: assistant_mail }),
    });

    if (!assistantIdResponse.ok) {
      const errorData = await assistantIdResponse.json();
      throw new Error(errorData.error);
    }

    const assistantIdData = await assistantIdResponse.json();
    const assistantId = assistantIdData.assistantId;

    // Step 2: Use the assistantId to fetch courses
    const response = await fetch(
      `/api/data/courses-from-assistant?assistantId=${assistantId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const data = await response.json();

    return data.courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getCourseFromId(courseId: number) {
  try {
    const response = await fetch(
      `/api/data/courses/course-from-id?id=${courseId}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const course = await response.json();
    console.log("Fetched course:", course);
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}
