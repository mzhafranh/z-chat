import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json(
                { error: "Username is required." },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: { refreshToken: null },
        });

        return NextResponse.json(
            { message: "Logout successful.", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json(
            { error: "Failed to logout user.", details: error instanceof Error ? error.message : "Unknown error"},
            { status: 500 }
        );
    }
}