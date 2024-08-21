import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { labId: string } }) {
  const labId = parseInt(params.labId, 10);

  try {
    // Fetch the lab details with IDs including the grid ID
    const lab = await prisma.lab.findUnique({
      where: { id: labId },
      select: {
        id: true,  // Lab ID
        class: {
          select: {
            id: true,  // Class ID
            course: {
              select: {
                assistants: {
                  select: {
                    assistant: {
                      select: {
                        id: true,  // Assistant ID
                        mail: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        grid: {
          select: {
            id: true,  // Grid ID
            sections: {
              select: {
                id: true,  // Section ID
                name: true,
                weight: true,
                subsections: {
                  select: {
                    id: true,  // Subsection ID
                    name: true,
                    weight: true,
                    criterion: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    // Fetch class students with IDs
    const classStudents = await prisma.classStudent.findMany({
      where: { classId: lab.class.id },
      select: {
        student: {
          select: {
            id: true,  // Student ID
            name: true
          }
        }
      }
    });

    // Extract grid data with IDs
    const gridData = lab.grid?.sections.map(section => ({
      id: section.id,
      name: section.name,
      weight: section.weight,
      subsections: section.subsections.map(subsection => ({
        id: subsection.id,
        name: subsection.name,
        weight: subsection.weight,
        criterion: subsection.criterion
      }))
    }));

    // Extract assistant names with IDs
    const assistantNames = lab.class.course.assistants.map(assistant => ({
      id: assistant.assistant.id,
      mail: assistant.assistant.mail,
    }));

    return NextResponse.json({
      labId: lab.id,
      classStudents: classStudents.map(cs => ({
        id: cs.student.id,
        name: cs.student.name
      })),
      gridId: 30,  // Include the grid ID in the response
      gridData,
      assistantNames
    });
  } catch (error) {
    console.error('Error fetching lab details:', error);
    return NextResponse.json({ error: 'Error fetching lab details' }, { status: 500 });
  }
}
