import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Extract the assistantId from the query parameters
    const { searchParams } = new URL(req.url);
    const assistantId = parseInt(searchParams.get("assistantId") || "", 10);

    if (isNaN(assistantId)) {
      return NextResponse.json({ error: "Invalid assistantId" }, { status: 400 });
    }

    // Fetch the assistant's courses along with classes, labs, and assistants
    const assistant = await prisma.assistant.findUnique({
      where: { id: assistantId },
      include: {
        courses: {
          include: {
            course: {
              include: {
                classes: {
                  include: {
                    labs: true, // Include all labs associated with each class
                  },
                },
                assistants: {
                  include: {
                    assistant: {
                      select: {
                        id: true,
                        mail: true, // Select only the assistant id and mail
                      },
                    },
                  },
                }, // Include assistants for the course with only id and mail
              },
            },
          },
        },
      },
    });

    if (!assistant) {
      return NextResponse.json({ error: "Assistant not found" }, { status: 404 });
    }

    // Extract the courses and their related data from the assistant object
    const courses = assistant.courses.map((courseAssistant) => {
      const course = courseAssistant.course;
      const assistants = course.assistants.map((ca) => ca.assistant);

      return {
        ...course,
        assistants, // Replace the join table data with actual assistant data
      };
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while fetching courses" }, { status: 500 });
  }
}
