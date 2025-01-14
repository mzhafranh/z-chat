import { NextResponse } from 'next/server';
import { verifyToken } from '../helpers/util';

export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
        return NextResponse.json({ error: "No Access Token" }, { status: 401 });
    }

    try {
        const user = await verifyToken(accessToken, process.env.JWT_SECRET);
        return NextResponse.json({ message: "Token Valid" }, { status: 200 });
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return NextResponse.json({ error: "Token Expired" }, { status: 401 });
        } else {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }
    }
}
