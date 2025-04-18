import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/next-auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Handle root path specifically
  if (path === "/") {
    const token = await getToken({
      req: request,
      secret: process.env.JWT_SECRET,
    });

    if (token) {
      // If admin user, redirect to admin dashboard
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      
      // If regular user, redirect to user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Non-authenticated users can access the landing page
    return NextResponse.next();
  }
  
  // Handle other protected routes as before
  const protectedAdminRoutes = path.startsWith("/admin") && 
    !path.startsWith("/admin/login") && 
    !path.startsWith("/admin/register");
    
  const protectedUserRoutes = path.startsWith("/dashboard") || 
    path.startsWith("/polls/create");

  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });

  // Redirect to login if accessing protected routes without being authenticated
  if (!token) {
    if (protectedAdminRoutes) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    if (protectedUserRoutes) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check for admin routes with proper type checking
  if (protectedAdminRoutes) {
    const userRole = token?.role as UserRole | undefined;
    if (!userRole || userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",  // Add home path to the matcher
    "/admin/:path*",
    "/dashboard/:path*",
    "/polls/create",
    "/polls/edit/:path*",
  ],
};