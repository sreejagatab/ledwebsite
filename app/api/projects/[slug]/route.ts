import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Project slug is required' },
        { status: 400 }
      );
    }
    
    // Fetch project by slug
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        galleryImages: {
          orderBy: { order: 'asc' },
        },
        testimonials: true,
      },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Fetch related projects in the same category
    const relatedProjects = await prisma.project.findMany({
      where: {
        category: project.category,
        id: { not: project.id },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        description: true,
        imageSrc: true,
      },
    });
    
    return NextResponse.json({
      project,
      relatedProjects,
    });
    
  } catch (error) {
    console.error(`Error fetching project with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the project' },
      { status: 500 }
    );
  }
} 