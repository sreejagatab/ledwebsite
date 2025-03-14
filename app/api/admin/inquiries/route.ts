import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

// GET - Fetch all inquiries for admin (with pagination and filtering)
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
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {};
    
    // Filter by status if provided
    if (status && ["NEW", "IN_PROGRESS", "COMPLETED", "ARCHIVED"].includes(status)) {
      filter.status = status;
    }
    
    // Search functionality
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } }
      ];
    }
    
    // Get total count for pagination
    const totalCount = await prisma.inquiry.count({
      where: filter
    });
    
    // Fetch inquiries with pagination
    const inquiries = await prisma.inquiry.findMany({
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
      inquiries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      }
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

// PATCH - Update multiple inquiries status (batch update)
export async function PATCH(request: NextRequest) {
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
    const updateSchema = z.object({
      ids: z.array(z.string()),
      status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "ARCHIVED"])
    });
    
    const validationResult = updateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { ids, status } = validationResult.data;
    
    // Update inquiries
    const updateData: any = { status };
    
    // If marking as completed, set respondedAt
    if (status === "COMPLETED") {
      updateData.respondedAt = new Date();
    }
    
    // Perform batch update
    const result = await prisma.$transaction(
      ids.map(id => 
        prisma.inquiry.update({
          where: { id },
          data: updateData
        })
      )
    );
    
    return NextResponse.json({
      message: `${result.length} inquiries updated successfully`,
      updatedCount: result.length
    });
  } catch (error) {
    console.error("Error updating inquiries:", error);
    return NextResponse.json(
      { error: "Failed to update inquiries" },
      { status: 500 }
    );
  }
} 