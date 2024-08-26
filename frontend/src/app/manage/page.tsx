"use client";

import React, { useEffect, useState } from "react";
import { Assistant, Course } from "../../../types/CorrectionTypes";
import { useSession } from "next-auth/react";
import { getCoursesForAssistant } from "../lib/data/courses";

const ManageComponent: React.FC = () => {
  const { data: session } = useSession();

  const assistantEmail = session?.user?.email;
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function updateCourse() {
      try {
        if (assistantEmail) {
          const tmpData = await getCoursesForAssistant(assistantEmail);
          setCourses[tmpData];
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    }

    if (assistantEmail) {
    }
  }, [assistantEmail]);

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default ManageComponent;
