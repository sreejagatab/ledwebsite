import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import slugify from 'slugify';

// Define validation schema for project creation/update
const projectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  category: z.string().min(2, { message: "Category is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  challenge: z.string().min(10, { message: "Challenge must be at least 10 characters" }),
  solution: z.string().min(10, { message: "Solution must be at least 10 characters" }),
  results: z.string().min(10, { message: "Results must be at least 10 characters" }),
  imageSrc: z.string().url({ message: "Image source must be a valid URL" }),
  featured: z.boolean().default(false),
  galleryImages: z.array(
    z.object({
      url: z.string().url({ message: "Image URL must be valid" }),
      alt: z.string().optional(),
      order: z.number().int().nonnegative().default(0),
    })
  ).optional().default([]),
});

// Helper function to check admin authorization
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { authorized: false, error: 'Not authenticated' };
  }
  
  const userRole = session.user.role;
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return { authorized: false, error: 'Not authorized' };
  }
  
  return { authorized: true };
}

// GET - Fetch all projects for admin (with more details)
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Fetch projects with pagination
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          galleryImages: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              testimonials: true,
            },
          },
        },
      }),
      prisma.project.count(),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
    
  } catch (error) {
    console.error('Error fetching projects for admin:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching projects' },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = projectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid project data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const projectData = validationResult.data;
    
    // Generate slug from title
    let slug = slugify(projectData.title, { lower: true, strict: true });
    
    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });
    
    // If slug exists, append a random string
    if (existingProject) {
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `${slug}-${randomString}`;
    }
    
    // Extract gallery images from project data
    const { galleryImages, ...projectDataWithoutGallery } = projectData;
    
    // Create project with transaction to ensure all related data is created
    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          ...projectDataWithoutGallery,
          slug,
        },
      });
      
      // Create gallery images if provided
      if (galleryImages && galleryImages.length > 0) {
        await tx.projectImage.createMany({
          data: galleryImages.map((image, index) => ({
            url: image.url,
            alt: image.alt || projectData.title,
            order: image.order || index,
            projectId: newProject.id,
          })),
        });
      }
      
      return newProject;
    });
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the project' },
      { status: 500 }
    );
  }
} 