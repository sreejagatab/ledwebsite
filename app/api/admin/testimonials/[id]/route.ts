import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for testimonial updates
const testimonialUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  company: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  content: z.string().min(10, "Testimonial content must be at least 10 characters").optional(),
  imageSrc: z.string().optional().nullable(),
  featured: z.boolean().optional(),
});

// Helper function to check if user is authenticated and has admin role
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authorized: false,
      error: "Not authenticated"
    };
  }
  
  const userRole = session.user.role;
  
  if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
    return {
      authorized: false,
      error: "Not authorized"
    };
  }
  
  return {
    authorized: true,
    error: null
  };
}

// GET - Fetch a single testimonial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Not authenticated" ? 401 : 403 }
    );
  }
  
  try {
    const testimonialId = params.id;
    
    // Fetch the testimonial
    const testimonial = await prisma.testimonial.findUnique({
      where: {
        id: testimonialId
      }
    });
    
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PATCH - Update a testimonial
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Not authenticated" ? 401 : 403 }
    );
  }
  
  try {
    const testimonialId = params.id;
    
    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: {
        id: testimonialId
      }
    });
    
    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = testimonialUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Update the testimonial
    const updatedTestimonial = await prisma.testimonial.update({
      where: {
        id: testimonialId
      },
      data: validationResult.data
    });
    
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Not authenticated" ? 401 : 403 }
    );
  }
  
  try {
    const testimonialId = params.id;
    
    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: {
        id: testimonialId
      }
    });
    
    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    
    // Delete the testimonial
    await prisma.testimonial.delete({
      where: {
        id: testimonialId
      }
    });
    
    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
} 