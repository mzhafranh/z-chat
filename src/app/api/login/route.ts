import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { prisma } from "../../../../lib/prisma";
import { createAccessToken, createRefreshToken } from '../helpers/util';

export async function POST(req: Request) {
    const body = await req.json();
    const { username } = body;
    console.log(username)
    // Validate user (mock example)

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = createAccessToken(username);
    const refreshToken = createRefreshToken(username);

    // if (username) {
    //     const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    //     return NextResponse.json({ token }, { status: 200 });
    // }

    // return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
