import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { labId: string } }) {
  try {
    // Extract the correction ID from the query parameters
    const { searchParams } = new URL(req.url);
    const correctionId = parseInt(searchParams.get('id') || '', 10);

    if (isNaN(correctionId)) {
      return NextResponse.json({ error: 'Invalid correction ID' }, { status: 400 });
    }

    // Delete the correction entry
    await prisma.correction.delete({
      where: {
        id: correctionId,
      },
    });

    return NextResponse.json({ message: 'Correction deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete correction' }, { status: 500 });
  }
}
