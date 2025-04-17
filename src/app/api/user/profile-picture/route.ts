import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get current user to find image path
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // If there's an image, try to remove the file
    if (user.image) {
      try {
        // Extract file path from URL and get absolute path
        const relativePath = user.image.replace(/^\//, '');
        const filePath = join(process.cwd(), 'public', relativePath);
        
        // Remove the file
        await unlink(filePath);
      } catch (error) {
        console.error("Failed to remove image file:", error);
        // Continue anyway - we'll update the database record
      }
    }
    
    // Update user to remove image reference
    await prisma.user.update({
      where: { id: userId },
      data: { image: null },
    });
    
    return NextResponse.json({ message: "Profile picture removed successfully" });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    return NextResponse.json(
      { message: "Error removing profile picture" },
      { status: 500 }
    );
  }
}