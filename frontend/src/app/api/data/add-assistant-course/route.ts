import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { courseId, assistantId } = await req.json();

    // Check if the assistant and course exist
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    const assistant = await prisma.assistant.findUnique({
      where: { id: assistantId },
    });

    if (!course || !assistant) {
      return NextResponse.json({ error: 'Course or Assistant not found' }, { status: 404 });
    }

    // Add the assistant to the course
    await prisma.courseAssistant.create({
      data: {
        courseId,
        assistantId,
      },
    });

    return NextResponse.json({ message: 'Assistant added to course successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while adding the assistant to the course' }, { status: 500 });
  }
}