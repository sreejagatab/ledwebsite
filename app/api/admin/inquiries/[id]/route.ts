import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for inquiry updates
const inquiryUpdateSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
  notes: z.string().optional().nullable(),
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

// GET - Fetch a single inquiry by ID
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
    const inquiryId = params.id;
    
    // Fetch the inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id: inquiryId
      }
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
}

// PATCH - Update an inquiry
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
    const inquiryId = params.id;
    
    // Check if inquiry exists
    const existingInquiry = await prisma.inquiry.findUnique({
      where: {
        id: inquiryId
      }
    });
    
    if (!existingInquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const validationResult = inquiryUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const updateData = { ...validationResult.data };
    
    // If marking as completed, set respondedAt
    if (updateData.status === "COMPLETED" && existingInquiry.status !== "COMPLETED") {
      updateData.respondedAt = new Date();
    }
    
    // Update the inquiry
    const updatedInquiry = await prisma.inquiry.update({
      where: {
        id: inquiryId
      },
      data: updateData
    });
    
    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an inquiry
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
    const inquiryId = params.id;
    
    // Check if inquiry exists
    const existingInquiry = await prisma.inquiry.findUnique({
      where: {
        id: inquiryId
      }
    });
    
    if (!existingInquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    
    // Delete the inquiry
    await prisma.inquiry.delete({
      where: {
        id: inquiryId
      }
    });
    
    return NextResponse.json(
      { message: "Inquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
} 