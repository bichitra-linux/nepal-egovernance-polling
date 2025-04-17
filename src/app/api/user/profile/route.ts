import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Handle multipart/form-data for file upload
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const image = formData.get('image') as File | null;

    // Check if the email already exists for another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 });
      }
    }
    
    // Handle image upload if provided
    let imagePath = session.user.image || null;
    
    if (image && image.size > 0) {
      // Create directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Directory creation failed', error);
      }
      
      // Generate unique filename
      const fileExt = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = join(uploadDir, fileName);
      
      // Convert file to buffer and save
      const buffer = Buffer.from(await image.arrayBuffer());
      await writeFile(filePath, buffer);
      
      // Set relative path for database
      imagePath = `/uploads/profiles/${fileName}`;
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        image: imagePath,
      },
    });
    
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
}