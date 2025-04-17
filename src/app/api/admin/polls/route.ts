import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Get all polls with user and vote count
    const polls = await prisma.poll.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      }
    });

    return NextResponse.json({ polls });
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { message: "Error fetching polls" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, userId } = body;

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Create poll with the provided user ID or the admin's ID
    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        userId: userId || session.user.id,
        status: "draft",
      },
    });

    return NextResponse.json({
      message: "Poll created successfully",
      poll
    }, { status: 201 });
  } catch (error) {
    console.error("Poll creation error:", error);
    return NextResponse.json({ message: "Error creating poll" }, { status: 500 });
  }
}