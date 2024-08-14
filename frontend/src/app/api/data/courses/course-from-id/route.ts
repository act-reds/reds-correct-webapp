import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Extract the course ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '', 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    // Fetch the course from the database using the Prisma client
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Return the course as JSON
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
