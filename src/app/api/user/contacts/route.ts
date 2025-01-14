import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    try {
        const { username } = body;
        // Fetch all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
            },
        });

        // Map users and fetch total notifications for each
        const usersWithNotifications = await Promise.all(
            users.map(async (user: { id: string; username: string; }) => {
                let totalNotifications = await prisma.message.count({
                    where: {
                        recipientId: username,
                        senderId: user.username,
                        isRead: false,
                    },
                });

                return {
                    id: user.id,
                    username: user.username,
                    totalNotifications,
                };
            })
        );

        return NextResponse.json(usersWithNotifications, { status: 200 });
    } catch (error) {
        console.error("Error fetching contact & notification data:", error);
        return NextResponse.json(
            { error: "Failed to fetch contact & notification data", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
