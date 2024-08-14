import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { classId, studentIds } = await req.json();

    if (!classId || !studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
    }

    // Add students to the class
    await prisma.classStudent.createMany({
      data: studentIds.map(studentId => ({
        classId,
        studentId
      })),
      skipDuplicates: true, // Avoids errors if some student-class pairs already exist
    });

    return NextResponse.json({ message: 'Students added to class successfully.' });
  } catch (error) {
    console.error('Error adding students to class:', error);
    return NextResponse.json({ error: 'An error occurred while adding students to the class' }, { status: 500 });
  }
}
