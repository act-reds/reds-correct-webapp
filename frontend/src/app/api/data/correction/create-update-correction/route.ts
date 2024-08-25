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
        include: { CorrectionStudent: true }
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
        (studentId) => !students.some((student) => student.id === studentId)
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
    }

    return NextResponse.json({
      message: id ? "Correction updated successfully" : "Correction created successfully",
      correction,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create/update correction" },
      { status: 500 }
    );
  }
}
