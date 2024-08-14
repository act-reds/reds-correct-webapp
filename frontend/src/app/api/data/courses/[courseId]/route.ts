import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const courseId = parseInt(params.courseId, 10);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID.' }, { status: 400 });
    }

    // Fetch classes for the course
    const classes = await prisma.class.findMany({
      where: { courseId },
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error('Error fetching classes for course:', error);
    return NextResponse.json({ error: 'An error occurred while fetching classes.' }, { status: 500 });
  }
}
