import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, courseId } = await req.json();

    if (!name || !courseId) {
      return NextResponse.json({ error: 'Class name and course ID are required.' }, { status: 400 });
    }

    // Retrieve class ID based on the name and courseId
    const classRecord = await prisma.class.findUnique({
      where: { name_courseId: { name, courseId } },
      select: { id: true }
    });

    if (!classRecord) {
      return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
    }

    return NextResponse.json({ id: classRecord.id });
  } catch (error) {
    console.error('Error retrieving class ID:', error);
    return NextResponse.json({ error: 'An error occurred while retrieving the class ID' }, { status: 500 });
  }
}