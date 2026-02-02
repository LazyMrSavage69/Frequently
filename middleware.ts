import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/management')) {
    const token = request.cookies.get('admin-token')?.value;
    
    if (request.nextUrl.pathname === '/management/login') {
      if (token) {
        // Déjà connecté, rediriger vers le dashboard
        return NextResponse.redirect(new URL('/management/dashboard', request.url));
      }
      return NextResponse.next();
    }
    
    if (!token) {
      return NextResponse.redirect(new URL('/management/login', request.url));
    }
    
    try {
      // Vérifier la validité du token
      if (!token) {
        return NextResponse.redirect(new URL('/management/login', request.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.redirect(new URL('/management/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/management/:path*'
};