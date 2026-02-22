import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	// 1. Check if the user already has a session cookie
	let sessionId = request.cookies.get('sessionId')?.value;

	// 2. Prepare the response so we can attach cookies to it
	const response = NextResponse.next();

	// 3. If they don't have one, generate a new ID and set the cookie
	if (!sessionId) {
		// crypto.randomUUID() is built into modern JavaScript/Node
		sessionId = crypto.randomUUID();

		// Set expiry for 3 hours (3 hours * 60 minutes * 60 seconds = 10800)
		response.cookies.set('sessionId', sessionId, {
			maxAge: 10800,
			path: '/', // Makes the cookie available on all pages
			httpOnly: true, // Security: Prevents client-side JS from reading it directly
			secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
			sameSite: 'lax',
		});
	}

	return response;
}

// Optional: You can configure the middleware to only run on specific paths
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
