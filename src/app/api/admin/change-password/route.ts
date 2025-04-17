import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    const userId = session.user.id;
    
    // Get the admin user with their password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });
    
    if (!user || !user.password) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Check if current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    // Log the admin activity
    // In a real app, you would create an activity log entry
    console.log(`Admin ${userId} changed their password`);
    
    return NextResponse.json({ message: "Admin password changed successfully" });
  } catch (error) {
    console.error("Error changing admin password:", error);
    return NextResponse.json(
      { message: "Error changing admin password" },
      { status: 500 }
    );
  }
}