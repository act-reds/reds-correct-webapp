import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, classId } = await req.json();

    if (!name || !classId) {
      return NextResponse.json(
        { success: false, error: 'Lab name and class ID are required.' },
        { status: 400 }
      );
    }

    // Check if the lab already exists
    const existingLab = await prisma.lab.findFirst({
      where: {
        name,
        classId,
      },
    });

    if (existingLab) {
      return NextResponse.json(
        { success: false, error: 'Lab already exists for this class.' },
        { status: 409 } // Conflict
      );
    }

    // Create a new lab
    const newLab = await prisma.lab.create({
      data: {
        name,
        classId,
      },
    });

    return NextResponse.json(
      { success: true, lab: newLab },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lab:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while creating the lab.' },
      { status: 500 }
    );
  }
}
