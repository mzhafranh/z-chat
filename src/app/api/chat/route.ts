import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: {
                timestamp: 'asc',
            },
        });
        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.log("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
      const body = await req.json();
      const { content, senderId, recipientId } = body;

      console.log(content, senderId, recipientId)
  
      if (!content || !senderId || !recipientId) {
        return NextResponse.json(
          { error: "Content, senderId, and recipientId are required" },
          { status: 400 }
        );
      }
  
      const newMessage = await prisma.message.create({
        data: {
          content,
          senderId,
          recipientId,
        },
      });
  
      return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
      console.error("Error creating message:", error);
  
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }