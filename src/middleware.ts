import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookie
  const token = request.cookies.get('token');

  const { pathname } = request.nextUrl;

  // 2. Halaman mana saja yang butuh login
  const protectedPaths = ['/home', '/game-eek', '/poop-survivors'];

  // 3. Cek apakah user sedang mencoba akses halaman terproteksi
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    // Jika mencoba masuk tapi tidak ada token, lempar ke halaman not-authorized
    return NextResponse.redirect(new URL('/auth/not-authorized', request.url));
  }

  return NextResponse.next();
}

// 4. Konfigurasi Matcher agar middleware hanya berjalan di rute yang kita mau
export const config = {
  matcher: [
    '/home/:path*', 
    '/game-eek/:path*', 
    '/poop-survivors/:path*'
  ],
};