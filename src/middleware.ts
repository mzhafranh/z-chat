import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const authHeader = req.headers.get('authorization'); // Get the Authorization header
    const token = authHeader?.split(' ')[1]; // Extract the token after "Bearer"

    if (!token) {
        return NextResponse.json({ error: "No Access Token"}, { status: 401 })
    }

    try {
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expired');
                    return NextResponse.json({ error: "Token Expired"}, { status: 401 })
                }
                console.log('Invalid token');
                return NextResponse.json({ error: "Invalid Token"}, { status: 401 })
            }
        });
    } catch (err) {
        console.log('Token Verification Failed:', err);
        return NextResponse.json({ error: "Token Verification Failed"}, { status: 500 })
    }
    return NextResponse.next();
}

// Specify which routes the middleware should run on
export const config = {
    matcher: ['/api'], // Run the middleware on these routes
};
