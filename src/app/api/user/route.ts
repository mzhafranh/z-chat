import prisma from "../../../../lib/prisma";
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

    const { username } = body;

    if (!username || typeof username !== "string") {
        return NextResponse.json(
            { error: "Invalid or missing 'username' field" },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.create({
            data: { username },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create user", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}


