import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { GridData } from '../../../../../../types/GridTypes';

export async function POST(req: NextRequest) {
    
  try {
    const { name, course, year, sections }: GridData = await req.json();

    // Create the grid
    const grid = await prisma.grid.create({
      data: {
        name,
        course,
        year,
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
