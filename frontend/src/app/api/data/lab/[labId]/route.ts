import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Adjust this path if needed

export async function GET(request: NextRequest, { params }: { params: { labId: string } }) {
  const labId = parseInt(params.labId, 10);

  try {
    // Fetch the lab data, including the grid if it exists
    const lab = await prisma.lab.findUnique({
      where: {
        id: labId,
      },
      include: {
        grid: true, // Include grid data, even if it might be null
      },
    });

    // Check if the lab exists
    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json(lab);
  } catch (error) {
    console.error("Error fetching lab data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

