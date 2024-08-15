import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const grids = await prisma.grid.findMany();
    return NextResponse.json({ grids }, { status: 200 });
  } catch (error) {
    console.error('Error fetching grids:', error);
    return NextResponse.json({ error: 'An error occurred while fetching grids.' }, { status: 500 });
  }
}