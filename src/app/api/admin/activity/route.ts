import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Simulate fetching admin activity logs
    // In a real application, you would have an ActivityLog model in your database
    const activities = [
      {
        action: "Created new poll: National Election Survey",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        action: "Modified user permissions for user ID: 12345",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        action: "Approved poll results for: Local Development Survey",
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      },
      {
        action: "System maintenance performed",
        timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      },
    ];
    
    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching admin activity:", error);
    return NextResponse.json(
      { message: "Error fetching admin activity" },
      { status: 500 }
    );
  }
}