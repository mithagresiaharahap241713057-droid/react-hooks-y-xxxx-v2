import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookie (sesuaikan dengan cara kamu menyimpan token)
  const token = request.cookies.get('token'); // Asumsi cookie kamu namanya 'token'

  const { pathname } = request.nextUrl;

  // 2. Proteksi rute yang butuh login
  const protectedRoutes = ['/home', '/game-eek', '/poop-survivors'];
  
  // Jika rute saat ini ada dalam daftar yang dilindungi
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Jika user TIDAK punya token
    if (!token) {
      // Redirect ke halaman not-authorized
      return NextResponse.redirect(new URL('/auth/not-authorized', request.url));
    }
  }

  // Izinkan request lanjut
  return NextResponse.next();
}

// 3. Konfigurasi Matcher agar middleware hanya jalan di path tertentu (optimal)
export const config = {
  matcher: ['/home/:path*', '/game-eek/:path*', '/poop-survivors/:path*'], 
};