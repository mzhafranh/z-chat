import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import prisma from "../../../../lib/prisma";
import { createAccessToken, createRefreshToken } from '../helpers/util';

export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    const refreshToken = authHeader?.split(' ')[1];
    if (!refreshToken) {
        let body
        try {
            body = await req.json();
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid JSON payload", details: error.message },
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
            try {
                const user = await prisma.user.create({
                    data: { username, refreshToken },
                });
                return NextResponse.json({ user, accessToken, refreshToken }, { status: 200 });
            } catch (error) {
                return NextResponse.json(
                    { error: "Failed to create user", details: error.message },
                    { status: 500 }
                );
            }
        } else {
            await prisma.user.update({
                where: { username },
                data: { refreshToken },
            });
            return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
        }
    } else {
        const user = await prisma.user.findUnique({
            where: { refreshToken },
        });
        if (!user){
            return NextResponse.json({ error: "Failed to find user"}, { status: 500 })
        }
        const accessToken = createAccessToken(user.username);
        return NextResponse.json({ user, accessToken, refreshToken }, { status: 200 });
    }
}
