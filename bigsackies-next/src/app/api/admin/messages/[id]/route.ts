import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const messageId = parseInt(id);

    const message = await prisma.messages.findUnique({
      where: { id: messageId },
      include: {
        users: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Mark as read if it's unread
    if (message.status === "Unread") {
      await prisma.messages.update({
        where: { id: messageId },
        data: { status: "Read" }
      });
    }

    return NextResponse.json(message);

  } catch (error) {
    console.error("Admin message fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const messageId = parseInt(id);
    const { response } = await request.json();

    if (!response) {
      return NextResponse.json({ error: "Response is required" }, { status: 400 });
    }

    const updatedMessage = await prisma.messages.update({
      where: { id: messageId },
      data: {
        response,
        responded_at: new Date(),
        status: "Replied"
      }
    });

    return NextResponse.json(updatedMessage);

  } catch (error) {
    console.error("Admin message response error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}