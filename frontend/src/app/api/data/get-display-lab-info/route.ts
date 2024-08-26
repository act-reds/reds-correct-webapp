// /app/api/data/get-display-lab-info/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assistantMail = searchParams.get('assistantMail');

  if (!assistantMail) {
    return NextResponse.json({ error: 'Invalid assistant email' }, { status: 400 });
  }

  try {
    const assistant = await prisma.assistant.findUnique({
      where: { mail: assistantMail },
      include: {
        courses: {
          include: {
            course: {
              include: {
                classes: {
                  include: {
                    labs: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!assistant) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
    }

    // Flatten and map the labs to the required format, including courseId
    const labs = assistant.courses.flatMap(({ course }) => {
      return course.classes.flatMap(({ labs, name: className, id: classId }) => {
        return labs.map(lab => ({
          labId: lab.id,
          labName: lab.name,
          courseName: course.name,
          courseYear: course.year,
          courseId: course.id, // Add courseId here
          className,
          classId,
        }));
      });
    });

    return NextResponse.json({ labs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
