import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
    const courseId = parseInt(params.courseId);
  
  if (!courseId) {
    return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
  }

  const { assistants } = await req.json();

  if (!Array.isArray(assistants)) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    // Begin a transaction to ensure data integrity
    await prisma.$transaction(async (prisma) => {
      // First, delete existing assistants for the course
      await prisma.courseAssistant.deleteMany({
        where: { courseId: Number(courseId) },
      });

      // Then, add the new assistants
      await prisma.courseAssistant.createMany({
        data: assistants.map((assistant: { id: number }) => ({
          courseId: Number(courseId),
          assistantId: assistant.id,
        })),
      });
    });

    return NextResponse.json({ message: 'Assistants updated successfully' });
  } catch (error) {
    console.error('Error updating assistants:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
