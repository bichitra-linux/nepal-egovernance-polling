import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    
    // Get total counts
    const totalPolls = await prisma.poll.count();
    const totalUsers = await prisma.user.count();
    const totalVotes = await prisma.vote.count();
    
    // Get recent polls with vote counts
    const recentPolls = await prisma.poll.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            votes: true
          }
        }
      }
    });

    // Format the data for the frontend
    const formattedRecentPolls = recentPolls.map(poll => ({
      id: poll.id,
      title: poll.title,
      voteCount: poll._count.votes
    }));

    return NextResponse.json({
      totalPolls,
      totalUsers,
      totalVotes,
      recentPolls: formattedRecentPolls
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Error fetching admin statistics" }, 
      { status: 500 }
    );
  }
}