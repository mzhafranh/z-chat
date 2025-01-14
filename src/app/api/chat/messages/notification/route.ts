import prisma from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { senderId, recipientId } = body;

        if (!senderId || !recipientId) {
            return NextResponse.json(
                { error: "Both senderId and recipientId are required" },
                { status: 400 }
            );
        }

        let totalNotifications = await prisma.message.count({
            where: {
                recipientId: recipientId,
                senderId: senderId,
                isRead: false,
            },
        });

        return NextResponse.json({ senderId, totalNotifications }, { status: 200 });

    } catch (error) {
        console.error("Error updating messages:", error);
        return NextResponse.json(
            { error: "Failed to update messages", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { senderId, recipientId } = body;

        if (!senderId || !recipientId) {
            return NextResponse.json(
                { error: "Both senderId and recipientId are required" },
                { status: 400 }
            );
        }

        const updatedMessages = await prisma.message.updateMany({
            where: {
                senderId,
                recipientId,
                isRead: false, // Update only unread messages
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json(
            {
                contact: senderId,
                message: "Messages updated successfully",
                count: updatedMessages.count,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating messages:", error);
        return NextResponse.json(
            { error: "Failed to update messages", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}