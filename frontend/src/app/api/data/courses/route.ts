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
    const { name, year, assistantEmails } = await request.json() as {
      name: string;
      year: number;
      assistantEmails: string[]; // Array of assistant emails
    };

    if (!name || !year || !Array.isArray(assistantEmails) || assistantEmails.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create the course
    const newCourse = await prisma.course.create({
      data: {
        name,
        year,
      },
    });

    // Find all assistants with the given emails
    const assistants = await prisma.assistant.findMany({
      where: {
        mail: {
          in: assistantEmails,
        },
      },
    });

    // Check if all provided emails exist in the database
    const assistantEmailsSet = new Set(assistantEmails);
    const foundEmails = new Set(assistants.map(assistant => assistant.mail));
    const missingEmails = [...assistantEmailsSet].filter(email => !foundEmails.has(email));

    if (missingEmails.length > 0) {
      return NextResponse.json({ error: `The following assistants do not exist: ${missingEmails.join(', ')}` }, { status: 404 });
    }

    // Link the existing assistants to the new course
    const assistantIds = assistants.map(assistant => assistant.id);
    await prisma.courseAssistant.createMany({
      data: assistantIds.map(id => ({
        courseId: newCourse.id,
        assistantId: id,
      })),
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error(error); // Log the error for debugging
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
