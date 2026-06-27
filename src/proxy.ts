import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect /login or root / to /admin if already logged in
  if (pathname === "/login" || pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (pathname === "/") {
      // Redirect root to /login if not logged in
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};
