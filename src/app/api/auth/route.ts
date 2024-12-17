import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

// POST handler
export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.split(' ')[1];
    console.log("Access Token:", accessToken)
    if (!accessToken) {
            return NextResponse.json({ error: "No Access Token"}, { status: 401 })
    } else {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expired');
                    return NextResponse.json({ error: "Token Expired"}, { status: 401 })
                } else {
                    console.log('Invalid token');
                    return NextResponse.json({ error: "Invalid Token"}, { status: 401 })
                }
            }
        });
        return NextResponse.json({ message: "Token Valid"}, { status: 200 })
    } 
}