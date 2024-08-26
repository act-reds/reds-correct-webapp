import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { CorrectionData, Section, Subsection, Student } from '../../../../../../../types/CorrectionTypes';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { labId: string } }) {
  try {
    const labId = parseInt(params.labId, 10);

    if (isNaN(labId)) {
      return NextResponse.json({ error: 'Invalid labId' }, { status: 400 });
    }

    // Retrieve all corrections for the specific labId
    const corrections = await prisma.correction.findMany({
      where: { labId },
      include: {
        lab: true, // Include the lab relationship
        CorrectionStudent: {
          include: { student: true }, // Include the full student object for each correction
        },
        subsectionMarks: {
          include: {
            subsection: {
              include: { section: true }, // Include the section related to the subsection
            },
          },
        },
      },
    });

    // Initialize an itemId counter starting from 0
    let itemIdCounter = 0;

    // Transform the data to fit the CorrectionData structure
    const transformedCorrections: CorrectionData[] = corrections.map((correction: CorrectionData) => {
      const transformedCorrection: CorrectionData = {
        id: correction.id,
        itemId: itemIdCounter++, // Set itemId and increment counter
        labId: correction.labId,
        appreciation: correction.appreciation,
        students: correction.CorrectionStudent.map((cs) => ({
          id: cs.student.id,
          name: cs.student.name,
          formation: cs.student.formation,
          mode: cs.student.mode,
          mail: cs.student.mail,
        })) as Student[],
        sections: Object.values(
          correction.subsectionMarks.reduce((acc, subsectionMark) => {
            const { subsection } = subsectionMark;

            if (!acc[subsection.section.id]) {
              acc[subsection.section.id] = {
                id: subsection.section.id,
                gridId: subsection.section.gridId,
                name: subsection.section.name,
                weight: subsection.section.weight,
                subsections: [],
              };
            }

            acc[subsection.section.id].subsections.push({
              id: subsection.id,
              sectionId: subsection.sectionId,
              name: subsection.name,
              weight: subsection.weight,
              criterion: subsection.criterion,
              result: subsectionMark.result,
            } as Subsection);

            return acc;
          }, {} as { [sectionId: number]: Section })
        ),
      };

      return transformedCorrection;
    });

    return NextResponse.json({ corrections: transformedCorrections });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve corrections' }, { status: 500 });
  }
}
