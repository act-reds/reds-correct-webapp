import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const classId = parseInt(url.searchParams.get('classId') || '', 10);

    if (isNaN(classId)) {
      return NextResponse.json({ error: 'Invalid or missing classId.' }, { status: 400 });
    }

    const labs = await prisma.lab.findMany({
      where: { classId },
    });

    return NextResponse.json({ labs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching labs:', error);
    return NextResponse.json({ error: 'An error occurred while fetching labs.' }, { status: 500 });
  }
}
