import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { labId: string } }) {
  try {
    const labId = parseInt(params.labId, 10);

    if (isNaN(labId)) {
      return NextResponse.json({ error: 'Invalid labId' }, { status: 400 });
    }

    // Retrieve all corrections for the specific labId
    const corrections = await prisma.correction.findMany({
      where: {
        labId: labId,
      },
      include: {
        lab: true, // Include the lab relationship
        subsectionMarks: true, // Include related subsection marks if needed
        CorrectionStudent: {
          include: {
            student: true, // Include the full student object for each correction
          },
        },
      },
    });

    // Transform the data to extract the student array directly
    const transformedCorrections = corrections.map((correction) => ({
      ...correction,
      students: correction.CorrectionStudent.map((cs) => cs.student),
    }));

    return NextResponse.json({ corrections: transformedCorrections });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve corrections' }, { status: 500 });
  }
}
