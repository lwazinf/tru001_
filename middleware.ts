import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication and specific tiers
const PROTECTED_ROUTES = ['/dash'];
const ALLOWED_TIERS = ['Gold', 'Black', 'CEO', 'Paused'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only check protected routes
  if (PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    // Get the Firebase auth session cookie
    const sessionCookie = request.cookies.get('session')?.value;
    
    // Get the user tier cookie
    const tierCookie = request.cookies.get('userTier')?.value;

    // If no session cookie or tier cookie is invalid, redirect to auth page
    if (!sessionCookie) {
      const url = new URL('/auth', request.url);
      return NextResponse.redirect(url);
    }
    
    if (!tierCookie || !ALLOWED_TIERS.includes(tierCookie)) {
      // User doesn't have proper tier - redirect to auth with appropriate message
      const url = new URL('/auth?tier=required', request.url);
      return NextResponse.redirect(url);
    }
    
    // Allow access to the protected route
    return NextResponse.next();
  }

  // For non-protected routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    '/dash/:path*',
  ],
}; 