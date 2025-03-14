import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for testimonial creation and updates
const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  position: z.string().optional(),
  content: z.string().min(10, "Testimonial content must be at least 10 characters"),
  imageSrc: z.string().optional(),
  featured: z.boolean().optional().default(false),
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

// GET - Fetch all testimonials for admin (with pagination)
export async function GET(request: NextRequest) {
  // Check admin authorization
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Not authenticated" ? 401 : 403 }
    );
  }
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured");
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    if (featured === "true") {
      filter.featured = true;
    } else if (featured === "false") {
      filter.featured = false;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.testimonial.count({
      where: filter
    });
    
    // Fetch testimonials with pagination
    const testimonials = await prisma.testimonial.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    
    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      }
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST - Create a new testimonial
export async function POST(request: NextRequest) {
  // Check admin authorization
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Not authenticated" ? 401 : 403 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = testimonialSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, company, position, content, imageSrc, featured } = validationResult.data;
    
    // Create the testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company: company || null,
        position: position || null,
        content,
        imageSrc: imageSrc || null,
        featured: featured || false
      }
    });
    
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
} 