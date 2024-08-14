import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') as string, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid class ID.' }, { status: 400 });
    }

    // Fetch the class by ID
    const classRecord = await prisma.class.findUnique({
      where: { id },
      include: { // Include related data if needed
        students: true, // Example: to include related students
        // assistants: true, // Uncomment if you want to include assistants
        // labs: true, // Uncomment if you want to include labs
      }
    });

    if (!classRecord) {
      return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
    }

    return NextResponse.json(classRecord);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the class.' }, { status: 500 });
  }
}
