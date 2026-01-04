import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './auth';

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const session = await getSession();

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return null;
}

