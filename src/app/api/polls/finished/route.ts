import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get only finished polls
    const polls = await prisma.poll.findMany({
      where: {
        status: "finished",
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
        finishedAt: "desc" // Order by most recently finished
      }
    });

    return NextResponse.json({ polls });
  } catch (error) {
    console.error("Error fetching finished polls:", error);
    return NextResponse.json(
      { message: "Error fetching finished polls" }, 
      { status: 500 }
    );
  }
}