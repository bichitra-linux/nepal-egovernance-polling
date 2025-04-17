import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get featured polls for homepage
    const currentDate = new Date();
    const polls = await prisma.poll.findMany({
      where: {
        status: "started",
        
      },
      take: 3, // Only get 3 for featured section
      include: {
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
    console.error("Error fetching active polls:", error);
    return NextResponse.json(
      { message: "Error fetching active polls" }, 
      { status: 500 }
    );
  }
}