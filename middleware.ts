import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
  const now = Date.now();
  const windowMs = 10000; // 10 seconds
  const limit = 10; // max requests per window

  const current = rateLimit.get(ip) || { count: 0, timestamp: now };

  // Reset if outside window
  if (now - current.timestamp > windowMs) {
    current.count = 0;
    current.timestamp = now;
  }

  current.count++;
  rateLimit.set(ip, current);

  if (current.count > limit) {
    return new NextResponse(JSON.stringify({
      success: false,
      error: 'Too many requests'
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '10'
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
}; 