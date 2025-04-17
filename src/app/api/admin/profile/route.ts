import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { name, email } = await request.json();
    
    const userId = session.user.id;
    
    // Check if the email already exists for another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 });
      }
    }
    
    // Update admin user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    // Log the admin activity
    // In a real app, you would create an activity log entry
    console.log(`Admin ${userId} updated their profile`);
    
    return NextResponse.json({
      message: "Admin profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { message: "Error updating admin profile" },
      { status: 500 }
    );
  }
}