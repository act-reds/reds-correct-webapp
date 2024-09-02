import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust the path based on your project structure
import { NextRequest } from 'next/server';



export async function GET(req: NextRequest, { params }: { params: { classId: string } }) {
  const classId = parseInt(params.classId, 10); // Convert classId to a number (if it's an integer ID)

  if (isNaN(classId)) {
    return NextResponse.json({ error: 'Invalid lab ID' }, { status: 400 });
  }
  
  try {
    // Fetch all students associated with the given lab
    const classStudents = await prisma.classStudent.findMany({
      where: { classId: classId }, // Adjust this based on your schema (classId or classId)
      select: {
        student: {
          select: {
            id: true,  // Student ID
            name: true, // Student name
            formation: true,
            mode: true,
            mail: true
          }
        }
      }
    });

    // Extract the student data from the result
    const students = classStudents.map(cs => cs.student);
    
    // Return the students as a JSON response
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching lab students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
