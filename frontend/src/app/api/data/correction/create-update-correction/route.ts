import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { CorrectionData } from "../../../../../../types/CorrectionTypes";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const correctionData: CorrectionData = await req.json();

    const { id, labId, appreciation, students, sections } = correctionData;

    let correction;

    if (id) {
      // If id exists, update the correction entry
      const existingCorrection = await prisma.correction.findUnique({
        where: { id: id },
        include: { CorrectionStudent: true, subsectionMarks: true },
      });

      if (!existingCorrection) {
        throw new Error("Correction not found");
      }

      // Collect existing student IDs
      const existingStudentIds = existingCorrection.CorrectionStudent.map(
        (cs) => cs.studentId
      );

      // Calculate student IDs to delete
      const studentIdsToDelete = existingStudentIds.filter(
        (studentId: number) =>
          !students.some((student) => student.id === studentId)
      );

      // Update the correction
      correction = await prisma.correction.update({
        where: { id: id },
        data: {
          appreciation,
          labId,
          CorrectionStudent: {
            // Create new student associations
            create: students
              .filter((student) => !existingStudentIds.includes(student.id))
              .map((student) => ({
                student: { connect: { id: student.id } },
              })),
            // Delete old student associations
            deleteMany: {
              studentId: {
                in: studentIdsToDelete,
              },
            },
          },
        },
        include: {
          CorrectionStudent: true, // Include the student relationship
        },
      });

      // Handle subsection marks (Update or Create)
      for (const section of sections) {
        for (const subsection of section.subsections) {
          const existingSubsectionMark = await prisma.subsectionMark.findUnique({
            where: {
              correctionId_subsectionId: {
                correctionId: id,
                subsectionId: subsection.id,
              },
            },
          });

          if (existingSubsectionMark) {
            // Update the existing subsection mark
            await prisma.subsectionMark.update({
              where: {
                id: existingSubsectionMark.id,
              },
              data: {
                result: subsection.result ?? 0,
              },
            });
          } else {
            // Create a new subsection mark
            await prisma.subsectionMark.create({
              data: {
                result: subsection.result ?? 0,
                correction: { connect: { id: id } },
                subsection: { connect: { id: subsection.id } },
              },
            });
          }
        }
      }
    } else {
      // If id is undefined, create a new correction
      correction = await prisma.correction.create({
        data: {
          appreciation,
          labId,
          CorrectionStudent: {
            create: students.map((student) => ({
              student: { connect: { id: student.id } },
            })),
          },
        },
        include: {
          CorrectionStudent: true, // Include the student relationship
        },
      });

      // Handle subsection marks (Create)
      for (const section of sections) {
        for (const subsection of section.subsections) {
          await prisma.subsectionMark.create({
            data: {
              result: subsection.result ?? 0,
              correction: { connect: { id: correction.id } },
              subsection: { connect: { id: subsection.id } },
            },
          });
        }
      }
    }

    return NextResponse.json({
      message: id
        ? "Correction updated successfully with subsection marks"
        : "Correction created successfully with subsection marks",
      correction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create/update correction with subsection marks" },
      { status: 500 }
    );
  }
}
