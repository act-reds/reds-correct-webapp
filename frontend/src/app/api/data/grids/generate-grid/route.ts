// app/api/generate-grid/route.ts
import prisma from '@/app/lib/prisma';
import { GridData } from '@/components/Grid/GridCreatePage/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, sections }: GridData = await req.json();

    // Create the grid
    const grid = await prisma.grid.create({
      data: {
        name,
        sections: {
          create: sections.map((section) => ({
            name: section.name,
            weight: section.weight,
            subsections: {
              create: section.subsections.map((subSection) => ({
                name: subSection.name,
                weight: subSection.weight,
                criterion: subSection.criterion,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(grid);
  } catch (error) {
    console.error('Error creating grid:', error);
    return NextResponse.error();
  }
}