import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Get all available polls (both active and completed)
    const polls = await prisma.poll.findMany({
      where: {
        OR: [
          { status: "started" },
          { status: "finished" }
        ]
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
        },
        votes: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true,
            voteType: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    // Transform the data to match the expected format in the dashboard
    const formattedPolls = polls.map(poll => {
      const hasVoted = poll.votes.length > 0;
      
      return {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        // Map Prisma status to what the frontend expects
        status: poll.status === "started" ? "active" : "finished",
        endDate: poll.finishedAt,
        totalVoters: poll._count.votes,
        createdAt: poll.createdAt,
        updatedAt: poll.updatedAt,
        hasVoted
      };
    });

    return NextResponse.json({ polls: formattedPolls });
  } catch (error) {
    console.error("Error fetching available polls:", error);
    return NextResponse.json(
      { message: "Error fetching available polls" }, 
      { status: 500 }
    );
  }
}