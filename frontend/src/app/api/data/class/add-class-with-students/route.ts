import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, courseId, studentIds }: { name: string; courseId: number; studentIds?: number[] } = await req.json();

    if (!name || !courseId) {
      return NextResponse.json({ error: 'Class name and course ID are required.' }, { status: 400 });
    }

    // Create the class
    const createdClass = await prisma.class.create({
      data: {
        name,
        courseId,
        students: {
          connect: studentIds?.map(id => ({ id })) || [], // Connect existing students to the class
        },
      },
    });

    return NextResponse.json(createdClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'An error occurred while creating the class.' }, { status: 500 });
  }
}
