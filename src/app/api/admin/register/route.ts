import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { UserRole } from "@/types/next-auth"; // Import the UserRole type

const prisma = new PrismaClient();
const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE || "admin123"; // Set this in .env

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, adminCode } = body;

    if (!name || !email || !password || !adminCode) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Verify admin code
    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ message: "Invalid admin authorization code" }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use the UserRole type explicitly
    const role: UserRole = "admin";

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      message: "Admin registered successfully",
      user: { id: user.id, name: user.name, email: user.email }
    }, { status: 201 });
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json({ message: "Error registering admin" }, { status: 500 });
  }
}