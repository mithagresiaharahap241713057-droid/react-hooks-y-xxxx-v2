import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil token dari cookie
  // Nama 'token' ini harus sama dengan yang ada di fungsi handleLogout tadi
  const token = request.cookies.get('token');

  const { pathname } = request.nextUrl;

  // 2. Tentukan halaman mana saja yang butuh login
  // Meskipun foldernya (authenticated), di URL tetap ditulis /home, /game-eek, dll.
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