import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

// Submit a vote
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to vote" }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pollId, voteType } = body;

    if (!pollId) {
      return NextResponse.json(
        { message: "Poll ID is required" }, 
        { status: 400 }
      );
    }

    // Check if poll exists and is active
    const poll = await prisma.poll.findUnique({
      where: { 
        id: parseInt(pollId),
        status: "started"
      }
    });

    if (!poll) {
      return NextResponse.json(
        { message: "Poll not found or not active" }, 
        { status: 404 }
      );
    }

    // Check if poll has ended
    if (poll.finishedAt && new Date(poll.finishedAt) < new Date()) {
      return NextResponse.json(
        { message: "This poll has ended and is no longer accepting votes" }, 
        { status: 400 }
      );
    }

    // Check if user has already voted on this poll
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: parseInt(pollId),
        userId: session.user.id
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { message: "You have already voted on this poll" }, 
        { status: 400 }
      );
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        pollId: parseInt(pollId),
        userId: session.user.id,
        voteType: voteType 
      }
    });

    return NextResponse.json({
      message: "Your vote has been recorded successfully",
      vote
    }, { status: 201 });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { message: "Error recording vote" }, 
      { status: 500 }
    );
  }
}

// Check if a user has voted on a specific poll
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to check vote status" }, 
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const pollId = url.searchParams.get('pollId');

    if (!pollId) {
      return NextResponse.json(
        { message: "Poll ID is required" }, 
        { status: 400 }
      );
    }

    // Check if user has already voted on this poll
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: parseInt(pollId),
        userId: session.user.id
      }
    });

    return NextResponse.json({ 
      hasVoted: !!existingVote,
      voteId: existingVote?.id
    });
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json(
      { message: "Error checking vote status" }, 
      { status: 500 }
    );
  }
}