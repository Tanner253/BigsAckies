import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, company, message, userId, userEmail } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Format the message with context
    const formattedMessage = `
=== HIRE ME CONTACT FORM ===
From: ${name} (${email})
Company: ${company || "Not specified"}
User ID: ${userId || "Not logged in"}
User Email: ${userEmail || "Not logged in"}
Timestamp: ${new Date().toISOString()}

Message:
${message}

===========================
    `;

    // Save message to database
    const savedMessage = await prisma.messages.create({
      data: {
        user_id: userId ? parseInt(userId) : null,
        user_email: email,
        message: formattedMessage,
        status: "Unread"
      }
    });

    console.log("Message saved to database:", savedMessage.id);
    
    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully",
      messageId: savedMessage.id
    });

  } catch (error) {
    console.error("Hire me contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 