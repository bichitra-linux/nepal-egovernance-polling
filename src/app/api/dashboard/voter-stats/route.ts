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

    // Get active polls count
    const activePolls = await prisma.poll.count({
      where: {
        status: "started"
      }
    });
    
    // Get completed polls count
    const completedPolls = await prisma.poll.count({
      where: {
        status: "finished"
      }
    });
    
    // Get total available polls (both active and completed)
    const availablePolls = activePolls + completedPolls;
    
    // Get polls that are closing soon (within next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const upcomingClosingPolls = await prisma.poll.findMany({
      where: {
        status: "started",
        finishedAt: {
          lte: sevenDaysFromNow,
          gt: new Date()
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        finishedAt: true
      },
      orderBy: {
        finishedAt: "asc"
      },
      take: 5 // Limit to 5 polls
    });

    return NextResponse.json({
      availablePolls,
      activePolls,
      completedPolls,
      upcomingClosingPolls
    });
  } catch (error) {
    console.error("Error fetching voter stats:", error);
    return NextResponse.json(
      { message: "Error fetching voter stats" }, 
      { status: 500 }
    );
  }
}