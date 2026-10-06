import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fitflow-jwt-super-secret-key-32chars-minimum-fitness"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/forgot-password");
  const isAdminPage = pathname.startsWith("/admin");
  const isMemberPage = pathname.startsWith("/member");

  const token = request.cookies.get("fitflow_token")?.value;

  let session: { role?: string; userId?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      session = payload as { role?: string; userId?: string };
    } catch {
      // Invalid token
    }
  }

  // Redirect authenticated users away from login page
  if (isAuthPage && session) {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  // Protect Admin routes
  if (isAdminPage) {
    if (!session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  // Protect Member routes
  if (isMemberPage) {
    if (!session) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    // Allow admins to view member portal if desired, or keep member only
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/login", "/forgot-password"],
};
