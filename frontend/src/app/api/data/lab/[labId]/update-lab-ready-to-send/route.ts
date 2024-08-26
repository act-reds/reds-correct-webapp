import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { labId } = await request.json();

    if (!labId) {
      return NextResponse.json({ error: 'Lab ID is required' }, { status: 400 });
    }

    await prisma.lab.update({
      where: { id: labId },
      data: { readyToSend: true },
    });

    return NextResponse.json({ message: 'Lab updated successfully' });
  } catch (error) {
    console.error('Failed to update lab:', error);
    return NextResponse.json({ error: 'Failed to update lab' }, { status: 500 });
  }
}
