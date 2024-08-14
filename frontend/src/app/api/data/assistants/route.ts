import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all assistants from the database
    const assistants = await prisma.assistant.findMany();
    
    // Return the assistants as a JSON response
    return NextResponse.json(assistants);
  } catch (error) {
    console.error('Error fetching assistants:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}