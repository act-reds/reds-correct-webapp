import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
    // Extract the assistantId from the query parameters
    const { searchParams } = new URL(req.url);
    const assistantId = parseInt(searchParams.get('assistantId') || '', 10);

    if (isNaN(assistantId)) {
      return NextResponse.json({ error: 'Invalid assistantId' }, { status: 400 });
    }

    // Fetch the assistant's courses
    const assistant = await prisma.assistant.findUnique({
      where: { id: assistantId },
      include: {
        courses: {
          include: {
            course: true, 
          },
        },
      },
    });

    if (!assistant) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
    }

    // Extract the courses from the assistant object
    const courses = assistant.courses.map((courseAssistant) => courseAssistant.course);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching courses' }, { status: 500 });
  }
}
