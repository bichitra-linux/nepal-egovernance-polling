import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    
    // Get all polls created by the current user
    const currentDate = new Date();
    const polls = await prisma.poll.findMany({
      where: {
        status: "started",
        
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        _count: {
          select: { votes: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ polls });
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json({ message: "Error fetching polls" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        userId: session.user.id,
        status: "published",
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