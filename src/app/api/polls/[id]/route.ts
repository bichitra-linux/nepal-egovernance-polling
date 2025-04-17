import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Use context.params instead of directly destructuring
    const session = await getServerSession(authOptions);
    const id = Number(context.params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid poll ID" }, 
        { status: 400 }
      );
    }

    // Create a query object
    const query: any = { id };
    
    // Only filter by status for non-admin users
    if (!session?.user?.role || session.user.role !== "admin") {
      query.status = "started";
    }

    const poll = await prisma.poll.findUnique({
      where: { id },
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
      }
    });

    if (!poll) {
      return NextResponse.json(
        { message: "Poll not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ poll });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { message: "Error fetching poll" }, 
      { status: 500 }
    );
  }
}