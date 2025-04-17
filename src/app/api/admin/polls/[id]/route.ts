import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "../../../auth/[...nextauth]/route";

// Get single poll details
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
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

    return NextResponse.json({ poll });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json({ message: "Error fetching poll" }, { status: 500 });
  }
}

// Update poll
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, userId, status, startedAt, finishedAt, finishDuration } = body;

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Check if poll exists
    const existingPoll = await prisma.poll.findUnique({ where: { id } });

    if (!existingPoll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    // Update the poll
    const updatedPoll = await prisma.poll.update({
      where: { id },
      data: {
        title,
        description,
        userId: userId || existingPoll.userId,
        status,
        startedAt,
        finishedAt,
        finishDuration,
      },
    });

    return NextResponse.json({
      message: "Poll updated successfully",
      poll: updatedPoll,
    });
  } catch (error) {
    console.error("Error updating poll:", error);
    return NextResponse.json({ message: "Error updating poll" }, { status: 500 });
  }
}

// Delete poll
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }

    // Check if poll exists
    const existingPoll = await prisma.poll.findUnique({ where: { id } });

    if (!existingPoll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    // First delete all votes associated with this poll
    await prisma.vote.deleteMany({
      where: { pollId: id },
    });

    // Then delete the poll
    await prisma.poll.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Poll deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting poll:", error);
    return NextResponse.json({ message: "Error deleting poll" }, { status: 500 });
  }
}
