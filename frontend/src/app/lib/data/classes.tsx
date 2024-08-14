export async function fetchClasses(courseId: number): Promise<any[]> {
  try {
    const response = await fetch(`/api/data/courses/${courseId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch classes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function createClass(
  name: string,
  courseId: number
): Promise<boolean | null> {
  try {
    const response = await fetch("/api/data/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const { id, exists } = await response.json();

    return exists;
  } catch (error) {
    // Optionally, log the error or handle it as needed
    console.error("Error creating class:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function getClassId(
  name: string,
  courseId: number
): Promise<number> {
  try {
    const response = await fetch("/api/data/class/get-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const { id } = await response.json();
    return id;
  } catch (error) {
    console.error("Error retrieving class ID:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function getClass(classId: number): Promise<any> {
  try {
    const response = await fetch(`/api/data/class/get-class?id=${classId}`, {
      method: "GET", // Use GET to fetch data
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const classData = await response.json();
    return classData;
  } catch (error) {
    console.error("Error retrieving class data:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function addStudentsToClass(
  classId: number,
  studentIds: number[]
): Promise<void> {
  try {
    const response = await fetch("/api/data/class/add-students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId, studentIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error("Error adding students to class:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
