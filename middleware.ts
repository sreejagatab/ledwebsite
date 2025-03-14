import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is an admin route
  const isAdminRoute = path.startsWith('/admin');
  
  // Skip middleware for API routes and public routes
  if (path.startsWith('/api') || !isAdminRoute) {
    return NextResponse.next();
  }
  
  // Allow access to login page
  if (path === '/admin/login') {
    return NextResponse.next();
  }
  
  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect to login if not authenticated
  if (!token) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Check if user has admin role
  const userRole = token.role as string;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  
  // Redirect to unauthorized page if not admin
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 