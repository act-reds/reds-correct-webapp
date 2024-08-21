import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(req: Request, { params }: { params: { gridId: string } }) {
  try {
    const gridId = parseInt(params.gridId);

    // Fetch sections and subsections by gridId
    const sections = await prisma.section.findMany({
      where: {
        gridId,
      },
      include: {
        subsections: true, // Include subsections in the result
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.error();
  }
}

