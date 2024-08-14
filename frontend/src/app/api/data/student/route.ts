import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const { students } = await req.json();

    // Validate input
    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: 'No student data provided' }, { status: 400 });
    }

    // Insert students into the database
    const createdStudents = await Promise.all(
      students.map(async (student: any) => {
        // Check if student already exists
        const existingStudent = await prisma.student.findUnique({
          where: { mail: student.mail },
        });

        if (existingStudent) {
          // If student exists, skip creating a new record
          return null;
        }

        // Create new student
        return await prisma.student.create({
          data: {
            name: student.name,
            formation: student.formation,
            mode: student.mode,
            mail: student.mail,
          },
        });
      })
    );

    // Filter out null values (existing students) and return created students
    const filteredCreatedStudents = createdStudents.filter((student) => student !== null);

    return NextResponse.json(filteredCreatedStudents, { status: 201 });
  } catch (error) {
    console.error('Error adding students:', error);
    return NextResponse.json({ error: 'An error occurred while adding students' }, { status: 500 });
  }
}

// Handle GET request
export async function GET(req: NextRequest) {
  try {
    // Fetch all students from the database
    const students = await prisma.student.findMany();

    // Return the list of students as JSON
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'An error occurred while fetching students' }, { status: 500 });
  }
}
