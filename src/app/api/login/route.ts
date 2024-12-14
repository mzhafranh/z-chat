import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = 'z-chat-messenger';

export async function POST(req: Request) {
    const body = await req.json();
    const { username } = body;
    console.log(username)
    // Validate user (mock example)
    if (username) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
