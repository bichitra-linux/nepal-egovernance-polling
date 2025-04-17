import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { UserRole } from "@/types/next-auth"; // Import the UserRole type

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }
    
    // Check if user has admin role with proper type safety
    const isAdmin = session.user.role === "admin";
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false, error: "Internal server error" }, { status: 500 });
  }
}