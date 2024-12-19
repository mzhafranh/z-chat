import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { senderId, recipientId } = body;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: senderId,
                        recipientId: recipientId,
                    },
                    {
                        senderId: recipientId,
                        recipientId: senderId,
                    },
                ],
            },
            orderBy: {
                timestamp: 'asc', // You can order messages by timestamp
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