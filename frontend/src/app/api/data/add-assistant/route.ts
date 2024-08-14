import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Check if the assistant already exists
    const existingAssistant = await prisma.assistant.findUnique({
      where: { mail: email },
    });

    if (existingAssistant) {
      return NextResponse.json({ message: 'Assistant already exists.' }, { status: 200 });
    }

    // Create a new assistant
    await prisma.assistant.create({
      data: {
        mail: email,
      },
    });

    return NextResponse.json({ message: 'Assistant added successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error adding assistant:', error);
    return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
  }
}