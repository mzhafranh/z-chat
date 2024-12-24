import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// POST handler
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

    console.log("username:",username)

    try {
        const user = await prisma.user.create({
            data: { username },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create user", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
              id: true,
              username: true,
            },
          });
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users", details: error.message },
            { status: 500 }
        );
    }
}
