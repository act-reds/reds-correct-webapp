import { NextResponse } from 'next/server';
import { PrismaClient, Course, Assistant } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const courses: Course[] = await prisma.course.findMany({
      include: {
        assistants: true, // Include assistants in the course data
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, year, assistantEmail } = await request.json() as {
      name: string;
      year: number;
      assistantEmail: string;
    };

    // Find the assistant by email
    const assistant: Assistant | null = await prisma.assistant.findUnique({
      where: { mail: assistantEmail },
    });

    if (!assistant) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
    }

    // Create the course and associate the assistant
    const newCourse: Course = await prisma.course.create({
      data: {
        name,
        year,
      },
    });

    // Link the new course to the assistant in the CourseAssistant table
    await prisma.courseAssistant.create({
      data: {
        courseId: newCourse.id,
        assistantId: assistant.id,
      },
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, year, assistantEmail } = await request.json() as {
      id: number;
      name: string;
      year: number;
      assistantEmail: string;
    };

    // Find the course by ID
    const course: Course | null = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Find the assistant by email
    const assistant: Assistant | null = await prisma.assistant.findUnique({
      where: { email: assistantEmail },
    });

    if (!assistant) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
    }

    // Update the course details and associate the assistant
    const updatedCourse: Course = await prisma.course.update({
      where: { id },
      data: {
        name,
        year,
        assistants: {
          connect: { id: assistant.id },
        },
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}
