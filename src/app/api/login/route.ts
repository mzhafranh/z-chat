import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";
import { createAccessToken, createRefreshToken } from '../helpers/util';

export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    const refreshToken = authHeader?.split(' ')[1];
    let newUser = false
    if (!refreshToken) {
        let body
        try {
            body = await req.json();
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid JSON payload", details: error instanceof Error ? error.message : "Unknown error" },
                { status: 400 }
            );
        }
        const { username } = body;

        const user = await prisma.user.findUnique({
            where: { username },
        });

        const accessToken = createAccessToken(username);
        const refreshToken = createRefreshToken(username);

        if (!user) {
            newUser = true
            try {
                const user = await prisma.user.create({
                    data: { username, refreshToken },
                });
                return NextResponse.json({ user, accessToken, refreshToken, newUser }, { status: 200 });
            } catch (error) {
                return NextResponse.json(
                    { error: "Failed to create user", details: error instanceof Error ? error.message : "Unknown error" },
                    { status: 500 }
                );
            }
        } else {
            const user = await prisma.user.update({
                where: { username },
                data: { refreshToken },
            });
            return NextResponse.json({ user, accessToken, refreshToken, newUser }, { status: 200 });
        }
    } else {
        try{
            const user = await prisma.user.findUnique({
                where: { refreshToken },
            });
    
            if (!user){
                return NextResponse.json({ error: "Failed to find user"}, { status: 500 })
            }

            const accessToken = createAccessToken(user.username);
            return NextResponse.json({ user, accessToken, refreshToken, newUser }, { status: 200 });
        } catch (error){
            return NextResponse.json({ error: "Failed to find user", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
        }
        
    }
}