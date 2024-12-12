import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const users = await prisma.message.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}