import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Assign visitor ID if missing
  let visitorId = req.cookies.get('fs_visitor_id')?.value;
  if (!visitorId) {
    visitorId = uuidv4();
    res.cookies.set('fs_visitor_id', visitorId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    });
  }

  // Example logic: pick a template based on User-Agent or IP, etc.
  const userAgent = req.headers.get('user-agent') || '';
  
  // Very simple example: if user-agent contains 'Mobile', assign template1, else template2
  const template = userAgent.toLowerCase().includes('mobile') ? 'template1' : 'template2';

  // Set cookie with template info for the page to read
  res.cookies.set('page_template', template, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  });

  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
