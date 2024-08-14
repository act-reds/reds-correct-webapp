// src/app/api/data/class/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, courseId } = await req.json();

    if (!name || !courseId) {
      return NextResponse.json({ error: 'Class name and course ID are required.' }, { status: 400 });
    }

    // Check if the class already exists
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        courseId,
      },
      select: {
        id: true
      }
    });

    if (existingClass) {
      // Return a response indicating that the class already exists
      return NextResponse.json({ id: existingClass.id, exists: true });
    }

    // Create the class
    const createdClass = await prisma.class.create({
      data: {
        name,
        courseId,
      },
    });

    // Return the created class ID
    return NextResponse.json({ id: createdClass.id, exists: false });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'An error occurred while creating the class' }, { status: 500 });
  }
}
