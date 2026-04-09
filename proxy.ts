import { NextResponse, NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  return NextResponse.next();
  // You can add custom logic here if needed, such as logging or modifying the request.
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
