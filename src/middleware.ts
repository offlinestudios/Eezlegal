import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateAnonSessionId } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Ensure anonymous session exists
  const anonSessionId = request.cookies.get('anonSessionId')?.value
  
  if (!anonSessionId) {
    const newAnonSessionId = generateAnonSessionId()
    response.cookies.set('anonSessionId', newAnonSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })
  }

  return response
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
}

