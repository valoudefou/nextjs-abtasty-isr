import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Check for feature flag in query params or cookies
  const flagFromQuery = request.nextUrl.searchParams.get('flagBirthField');
  const flagFromCookie = request.cookies.get('flagBirthField')?.value;
  
  let flagValue = 'false';
  
  // Priority: query param > cookie > default (false)
  if (flagFromQuery !== null) {
    flagValue = flagFromQuery === 'true' ? 'true' : 'false';
    // Set cookie when flag comes from query param
    response.cookies.set('flagBirthField', flagValue, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  } else if (flagFromCookie) {
    flagValue = flagFromCookie;
  }
  
  // Set header for server-side access
  response.headers.set('x-flag-flagBirthField', flagValue);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
