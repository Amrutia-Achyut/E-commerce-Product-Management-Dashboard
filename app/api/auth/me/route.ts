import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, authenticated: true, username: session.username },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }
}

