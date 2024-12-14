// middleware/checkAuth.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = localStorage.getItem('authToken');
    console.log('Middleware triggered', req.url); // Debugging

    if (token) {
        // If token exists, redirect to /chat
        return NextResponse.redirect(new URL('/chat', req.url));
    } else {
        // If no token, redirect to /login
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/']
};