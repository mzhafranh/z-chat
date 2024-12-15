import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const authHeader = req.headers.get('authorization'); // Get the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

    if (!token) {
        // If no token, redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to the request (Optional)
        req.user = decoded;
    } catch (err) {
        console.error('Token verification failed:', err);

        // Redirect to login on invalid token
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If valid, proceed to the requested page
    return NextResponse.next();
}

// Specify which routes the middleware should run on
export const config = {
    matcher: ['/chat', '/'], // Run the middleware on these routes
};
