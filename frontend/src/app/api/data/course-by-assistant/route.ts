import { NextResponse } from 'next/server';
import { PrismaClient, Course, Assistant } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Extract email from query parameters
    const url = new URL(request.url);
    const assistantEmail = url.searchParams.get('email');

    if (!assistantEmail) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Find the assistant by email
    const assistant = await prisma.assistant.findUnique({
      where: { mail: assistantEmail },
    });

    if (!assistant) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
    }

    // Fetch all courses associated with the assistant
    const courses = await prisma.course.findMany({
      where: {
        assistants: {
          some: {
            assistantId: assistant.id,
          },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client disconnects after operation
  }
}
