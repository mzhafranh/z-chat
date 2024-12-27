import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { senderId, recipientId, page = 1, chatAccessTime = new Date() } = body;
        const limit = 20;
        const skip = (page - 1) * limit;

        const messages = await prisma.message.findMany({
            where: {
                AND: [
                    {
                        timestamp: {
                            lt: chatAccessTime,
                        },
                    },
                    {
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
                ],
            },
            orderBy: {
                timestamp: 'desc',
            },
            skip,
            take: limit,
        });

        const totalMessages = await prisma.message.count({
            where: {
                AND: [
                    {
                        timestamp: {
                            lt: chatAccessTime,
                        },
                    },
                    {
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
                ],
            },
        });

        
        return NextResponse.json(
            {
                messages,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalMessages / limit),
                    totalMessages,
                },
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

export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        // Attempt to delete the message with the provided ID
        const deletedMessage = await prisma.message.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Message deleted successfully', deletedMessage, id }, {status: 200});
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { error: 'Failed to delete the message', details: error.message },
            { status: 500 }
        );
    }
}