import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, newContent } = body;
        if (!id || !newContent) {
            return NextResponse.json({ error: 'Message ID and new content is required' }, { status: 400 });
        }
        const updatedMessage = await prisma.message.update({
            where: { id },
            data: {
                content: newContent,
                updatedAt: new Date(),
            },
        });
        if (!updatedMessage) {
            return NextResponse.json({ error: 'Message not found' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Message updated successfully', data: updatedMessage }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update the message', details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }
        
        const deletedMessage = await prisma.message.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Message deleted successfully', deletedMessage, id }, { status: 200 });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { error: 'Failed to delete the message', details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}