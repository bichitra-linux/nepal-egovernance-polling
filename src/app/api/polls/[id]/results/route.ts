import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const id = Number(context.params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }

    // Get the poll
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    if (!poll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    // Get vote counts by type
    const positiveVotes = await prisma.vote.count({
      where: {
        pollId: id,
        voteType: "positive",
      },
    });

    const negativeVotes = await prisma.vote.count({
      where: {
        pollId: id,
        voteType: "negative",
      },
    });

    const totalVotes = positiveVotes + negativeVotes;

    // Calculate percentages
    const positivePercentage = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;
    const negativePercentage = totalVotes > 0 ? Math.round((negativeVotes / totalVotes) * 100) : 0;

    return NextResponse.json({
      poll,
      results: {
        totalVotes,
        positiveVotes,
        negativeVotes,
        positivePercentage,
        negativePercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching poll results:", error);
    return NextResponse.json({ message: "Error fetching poll results" }, { status: 500 });
  }
}
