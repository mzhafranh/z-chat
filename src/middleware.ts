import { NextResponse } from 'next/server';
import { jwtVerify } from "jose";

export async function middleware(req: { headers: { get: (arg0: string) => any; }; nextUrl: { pathname: any; }; }) {
    const authHeader = req.headers.get('authorization'); // Get the Authorization header
    const token = authHeader?.split(' ')[1]; // Extract the token after "Bearer"

    const { pathname } = req.nextUrl;

    // Exclude a specific route
    if (pathname === '/api/auth' || pathname === '/api/login') {
        return NextResponse.next(); // Skip middleware for this route
    }

    if (!token) {
        return NextResponse.json({ error: "No Access Token" }, { status: 401 })
    }

    try {
        // Use jose for token verification
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        return NextResponse.next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

}

// Specify which routes the middleware should run on
export const config = {
    matcher: ['/api/:path*'], // Run the middleware on these routes
};
