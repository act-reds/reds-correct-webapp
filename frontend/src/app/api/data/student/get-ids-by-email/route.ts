import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { emails } = await req.json();

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: 'Invalid emails array provided.' }, { status: 400 });
    }

    // Find students by emails
    const students = await prisma.student.findMany({
      where: {
        mail: { in: emails },
      },
      select: { id: true },
    });

    const studentIds = students.map(student => student.id);

    return NextResponse.json({ studentIds });
  } catch (error) {
    console.error('Error fetching student IDs by email:', error);
    return NextResponse.json({ error: 'An error occurred while fetching student IDs' }, { status: 500 });
  }
}
