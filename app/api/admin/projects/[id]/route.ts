import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import slugify from 'slugify';

// Define validation schema for project update
const projectUpdateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
  category: z.string().min(2, { message: "Category is required" }).optional(),
  location: z.string().min(2, { message: "Location is required" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).optional(),
  challenge: z.string().min(10, { message: "Challenge must be at least 10 characters" }).optional(),
  solution: z.string().min(10, { message: "Solution must be at least 10 characters" }).optional(),
  results: z.string().min(10, { message: "Results must be at least 10 characters" }).optional(),
  imageSrc: z.string().url({ message: "Image source must be a valid URL" }).optional(),
  featured: z.boolean().optional(),
  galleryImages: z.array(
    z.object({
      id: z.string().optional(), // Existing image ID
      url: z.string().url({ message: "Image URL must be valid" }),
      alt: z.string().optional(),
      order: z.number().int().nonnegative().default(0),
    })
  ).optional(),
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

// GET - Fetch a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
    
    const { id } = params;
    
    // Fetch project by ID
    const project = await prisma.project.findUnique({
      where: { id },
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
    
    return NextResponse.json({ project });
    
  } catch (error) {
    console.error(`Error fetching project with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the project' },
      { status: 500 }
    );
  }
}

// PATCH - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
    
    const { id } = params;
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        galleryImages: true,
      },
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = projectUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid project data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const updateData = validationResult.data;
    
    // Generate new slug if title is updated
    let slug = existingProject.slug;
    if (updateData.title) {
      slug = slugify(updateData.title, { lower: true, strict: true });
      
      // Check if new slug already exists for a different project
      const slugExists = await prisma.project.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });
      
      // If slug exists, append a random string
      if (slugExists) {
        const randomString = Math.random().toString(36).substring(2, 8);
        slug = `${slug}-${randomString}`;
      }
    }
    
    // Extract gallery images from update data
    const { galleryImages, ...projectUpdateWithoutGallery } = updateData;
    
    // Update project with transaction to ensure all related data is updated
    const updatedProject = await prisma.$transaction(async (tx) => {
      // Update the project
      const updated = await tx.project.update({
        where: { id },
        data: {
          ...projectUpdateWithoutGallery,
          slug,
        },
      });
      
      // Update gallery images if provided
      if (galleryImages && galleryImages.length > 0) {
        // Get existing image IDs
        const existingImageIds = existingProject.galleryImages.map(img => img.id);
        
        // Identify images to keep (those with IDs in the update)
        const updatedImageIds = galleryImages
          .filter(img => img.id)
          .map(img => img.id as string);
        
        // Delete images that are not in the update
        const imagesToDelete = existingImageIds.filter(id => !updatedImageIds.includes(id));
        
        if (imagesToDelete.length > 0) {
          await tx.projectImage.deleteMany({
            where: {
              id: { in: imagesToDelete },
            },
          });
        }
        
        // Update existing images and create new ones
        for (const image of galleryImages) {
          if (image.id) {
            // Update existing image
            await tx.projectImage.update({
              where: { id: image.id },
              data: {
                url: image.url,
                alt: image.alt,
                order: image.order,
              },
            });
          } else {
            // Create new image
            await tx.projectImage.create({
              data: {
                url: image.url,
                alt: image.alt || updated.title,
                order: image.order,
                projectId: id,
              },
            });
          }
        }
      }
      
      return updated;
    });
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    });
    
  } catch (error) {
    console.error(`Error updating project with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }
    
    const { id } = params;
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Delete project (cascade will handle related records)
    await prisma.project.delete({
      where: { id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
    
  } catch (error) {
    console.error(`Error deleting project with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the project' },
      { status: 500 }
    );
  }
} 