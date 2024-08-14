"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

const SignIn: React.FC = () => {
  const [assistants, setAssistants] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch("/api/data/assistants");
        if (!response.ok) {
          throw new Error("Failed to fetch assistants");
        }
        const data = await response.json();
        setAssistants(data);
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/data/student");

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();

    fetchAssistants();
  }, []);

  return (
    <div>
      <h1>Sign In</h1>
      <div>
        <h2>Existing Assistants</h2>
        {assistants.length > 0 ? (
          <ul>
            {assistants.map((assistant) => (
              <li key={assistant.id}>
                {assistant.name} and {assistant.surname} and ({assistant.mail})
              </li>
            ))}
          </ul>
        ) : (
          <p>No assistants found.</p>
        )}
        <h2>Existing Students</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} and ({student.mail})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SignIn;
