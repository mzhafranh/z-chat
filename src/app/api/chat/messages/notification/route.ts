import prisma from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { senderId, recipientId } = body;

        const totalNotification = await prisma.message.count({
            where: {
                senderId: senderId,
                recipientId: recipientId,
                isRead: false,
            },
        });

        return NextResponse.json(
            {
                totalNotification
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error fetching messages:", error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}