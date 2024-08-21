import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { labId: string } }) {
  const { gridId } = await request.json();
  const labId = parseInt(params.labId, 10);

  try {
    await prisma.lab.update({
      where: { id: labId },
      data: { gridId: gridId },
    });
    return NextResponse.json({ message: 'Lab updated successfully' });
  } catch (error) {
    console.error('Error updating lab with grid:', error);
    return NextResponse.error();
  }
}