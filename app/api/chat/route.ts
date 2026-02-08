import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/app/(auth)/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Proxy] Received request for chat:', body.id);

    // Get session to extract user ID
    const session = await auth();
    const userId = session?.user?.id;

    console.log('[Proxy] User ID from session:', userId);

    // Get session cookie from the request
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    // Forward the request to the FastAPI backend with session cookie and user ID
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken && { 'Cookie': `session_token=${sessionToken.value}` }),
        ...(userId && { 'X-User-Id': userId }),
      },
      body: JSON.stringify(body),
    });

    console.log('[Proxy] Backend response status:', response.status);
    console.log('[Proxy] Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // CRITICAL: Return the stream without buffering
    // The response.body is a ReadableStream that must be passed directly
    console.log('[Proxy] Streaming response back to frontend');
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'X-Vercel-AI-UI-Message-Stream': 'v1',
      },
    });
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
