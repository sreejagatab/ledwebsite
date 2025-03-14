import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Define query parameters schema
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'title', 'category']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: NextRequest) {
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const validatedQuery = querySchema.safeParse(queryParams);
    
    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validatedQuery.error.format() },
        { status: 400 }
      );
    }
    
    const { page, limit, category, featured, search, sortBy, sortOrder } = validatedQuery.data;
    
    // Build filter conditions
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (featured) {
      where.featured = featured === 'true';
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: {
          galleryImages: {
            orderBy: { order: 'asc' },
            select: { id: true, url: true, alt: true }
          },
          testimonials: {
            where: { featured: true },
            take: 1,
            select: { id: true, name: true, position: true, company: true, content: true, imageUrl: true }
          }
        }
      }),
      prisma.project.count({ where })
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Return response
    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching projects' },
      { status: 500 }
    );
  }
} 