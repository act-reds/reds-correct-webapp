import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { labId: string } }) {
  try {
    const labId = parseInt(params.labId, 10);

    if (isNaN(labId)) {
      return NextResponse.json({ error: 'Invalid labId' }, { status: 400 });
    }

    // Retrieve the lab with its associated class, course, and assistants through CourseAssistant
    const lab = await prisma.lab.findUnique({
      where: { id: labId },
      include: {
        class: {
          include: {
            course: {
              include: {
                assistants: {
                  include: {
                    assistant: true, // Fetch the assistant data
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    // Map and transform the data to fit your needs
    const assistants = lab.class.course.assistants.map((courseAssistant) => ({
      id: courseAssistant.assistant.id,
      mail: courseAssistant.assistant.mail,
    }));
    
    return NextResponse.json({ assistants });
  } catch (error) {
    console.error('Failed to retrieve assistants:', error);
    return NextResponse.json({ error: 'Failed to retrieve assistants' }, { status: 500 });
  }
}
